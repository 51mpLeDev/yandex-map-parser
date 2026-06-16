<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CompanyController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', function (Request $request) {
        return response()->json($request->user());
    });
});

Route::prefix('company')->group(function () {
    Route::post('/', [CompanyController::class, 'store']);
    Route::get('/', [CompanyController::class, 'showCurrent']);
    Route::get('/{company}', [CompanyController::class, 'show']);
    Route::post('/{company}/refresh', [CompanyController::class, 'refresh']);
});
