<?php

namespace App\Jobs;

use App\Models\Company;
use App\Models\Review;
use App\Services\YandexMapsParserService;
use Carbon\Carbon;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Throwable;

class ParseCompanyJob implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    public int $backoff = 60;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public int $companyId
    )
    {
    }

    /**
     * Execute the job.
     */
    public function handle(YandexMapsParserService $parser): void
    {
        $company = Company::findOrFail($this->companyId);

        try {
            $result = $parser->parse($company->url);

            DB::transaction(function () use ($company, $result) {
                $company->update([
                    'title' => $result['title'] ?? null,
                    'rating' => $result['rating'] ?? null,
                    'ratings_count' => $result['ratings_count'] ?? 0,
                    'reviews_count' => $result['reviews_count'] ?? 0,
                    'status' => 'completed',
                    'last_error' => null,
                    'last_parsed_at' => now(),
                ]);

                $rows = [];

                foreach ($result['reviews'] ?? [] as $review) {
                    $rows[] = [
                        'company_id' => $company->id,
                        'external_id' => $review['external_id'],
                        'author' => $review['author'],
                        'rating' => $review['rating'],
                        'text' => $review['text'],
                        'published_at' => ! empty($review['published_at'])
                            ? Carbon::parse($review['published_at'])
                            : null,
                    ];
                }

                if ($rows !== []) {
                    Review::upsert(
                        $rows,
                        ['company_id', 'external_id'],
                        [
                            'author',
                            'rating',
                            'text',
                            'published_at',
                            'updated_at',
                        ]
                    );
                }
            });
        } catch (Throwable $e) {
            Log::error('Company parsing failed', [
                'company_id' => $company->id,
                'message' => $e->getMessage(),
            ]);

            $company->update([
                'status' => 'failed',
                'last_error' => mb_substr($e->getMessage(), 0, 1000),
            ]);

            throw $e;
        }
    }
}
