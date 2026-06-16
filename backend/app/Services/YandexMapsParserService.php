<?php

namespace App\Services;

use RuntimeException;
use Symfony\Component\Process\Exception\ProcessFailedException;
use Symfony\Component\Process\Process;

class YandexMapsParserService
{
    public function parse(string $url): array
    {
        $process = new Process([
            'node',
            base_path('../parser/dist/index.js'),
            $url,
        ]);

        $process->setTimeout(600);

        $process->run();

        if (! $process->isSuccessful()) {
            throw new ProcessFailedException($process);
        }

        $output = trim($process->getOutput());

        if ($output === '') {
            throw new RuntimeException('Parser returned empty output.');
        }

        $data = json_decode($output, true);

        if (! is_array($data)) {
            throw new RuntimeException('Parser returned invalid JSON.');
        }

        $required = [
            'title',
            'rating',
            'ratingsCount',
            'reviewsCount',
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
