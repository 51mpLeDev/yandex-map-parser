<?php

namespace App\Jobs;

use App\Models\Company;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

class ParseCompanyJob implements ShouldQueue
{
    use Queueable;

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
    public function handle(): void
    {
        $company = Company::findOrFail($this->companyId);
        Log::debug('company', [$company]);
    }
}
