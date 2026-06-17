<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use RuntimeException;

class YandexMapsParserService
{
    public function parse(string $url): array
    {
        $response = Http::timeout(600)->post(
            'http://playwright:3000/parse',
            [
                'url' => $url,
            ]
        );

        if (! $response->successful()) {
            throw new RuntimeException(
                'Parser request failed: ' . $response->body()
            );
        }

        $data = $response->json();

        Log::info("response data", [$data]);

        if (! is_array($data)) {
            throw new RuntimeException('Parser returned invalid JSON.');
        }

        $required = [
            'title',
            'rating',
            'ratings_count',
            'reviews_count',
            'reviews',
        ];

        foreach ($required as $field) {
            if (! array_key_exists($field, $data)) {
                throw new RuntimeException(
                    sprintf('Parser response is missing required field "%s".', $field)
                );
            }
        }

        return $data;
    }
}
