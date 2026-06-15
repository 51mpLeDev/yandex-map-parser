<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CompanyController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);



});

Route::prefix('company')->group(function () {
    Route::post('/', [CompanyController::class, 'store']);
    Route::get('/{company}', [CompanyController::class, 'show']);
    Route::post('/{company}/refresh', [CompanyController::class, 'refresh']);
});
