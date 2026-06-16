<?php

namespace App\Services;

use App\Jobs\ParseCompanyJob;
use App\Models\Company;

class CompanyService
{
    public function createOrUpdate(string $url): Company
    {
        $company = Company::firstOrCreate(
            ['url' => $url],
            [
                'status' => 'processing',
            ]
        );

        if ($company->wasRecentlyCreated) {
            ParseCompanyJob::dispatch($company->id);

            return $company;
        }

        if ($company->status !== 'processing') {
            $company->update([
                'status' => 'processing',
                'last_error' => null,
            ]);

            ParseCompanyJob::dispatch($company->id);
        }

        return $company->fresh();
    }

    public function refresh(Company $company): void
    {
        $company->update([
            'status' => 'processing',
            'last_error' => null,
        ]);

        ParseCompanyJob::dispatch($company->id);
    }
}
