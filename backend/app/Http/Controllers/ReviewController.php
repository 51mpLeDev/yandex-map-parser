<?php

namespace App\Http\Controllers;

use App\Http\Resources\ReviewResource;
use App\Models\Company;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ReviewController extends Controller
{
    public function index(Company $company): AnonymousResourceCollection
    {
        return ReviewResource::collection(
            $company->reviews()->latest()->paginate(50)
        );
    }
}
