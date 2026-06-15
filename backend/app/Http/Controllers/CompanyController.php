<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCompanyRequest;
use App\Http\Resources\CompanyResource;
use App\Models\Company;
use App\Services\CompanyService;

class CompanyController extends Controller
{
    public function __construct(
        private readonly CompanyService $service,
    ) {
    }

    public function store(StoreCompanyRequest $request): CompanyResource
    {
        $company = $this->service->createOrUpdate(
            $request->string('url')->toString()
        );

        return new CompanyResource($company);
    }

    public function show(Company $company): CompanyResource
    {
        return new CompanyResource($company);
    }

    public function refresh(Company $company): CompanyResource
    {
        $this->service->refresh($company);

        return new CompanyResource($company->fresh());
    }
}
