<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\API\PropertyController;
use App\Http\Controllers\API\UtilityBillController;
use App\Http\Controllers\API\UserController;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
});


Route::middleware(['auth:sanctum'])->group(function () {
    // Property routes
    Route::prefix('properties')->group(function () {
        Route::get('/', [PropertyController::class, 'index']);
        Route::get('/dashboard', [PropertyController::class, 'dashboard']);
        Route::get('/{id}', [PropertyController::class, 'show']);
        Route::post('/', [PropertyController::class, 'store']);
        Route::put('/{id}', [PropertyController::class, 'update']);
        Route::delete('/{id}', [PropertyController::class, 'destroy']);
        Route::get('/{propertyId}/utility-bills', [UtilityBillController::class, 'getByPropertyId']);
        Route::get('/{propertyId}/consumption-history',  [PropertyController::class, 'getConsumptionHistory']);
    });

    // Utility routes
    Route::prefix('utility-bills')->group(function () {
        Route::get('/{billId}', [UtilityBillController::class, 'show']);
        Route::get('/', [UtilityBillController::class, 'index']);
        Route::post('/', [UtilityBillController::class, 'store']);
        Route::put('/{id}', [UtilityBillController::class, 'update']);
        Route::delete('/{id}', [UtilityBillController::class, 'destroy']);
    });

    // Users routes
    Route::prefix('users')->group(function () {
        Route::get('/{userId}', [UserController::class, 'show']);
        Route::get('/', [UserController::class, 'index']);
        Route::post('/', [UserController::class, 'store']);
        Route::put('/{id}', [UserController::class, 'update']);
        Route::delete('/{id}', [UserController::class, 'destroy']);
    });
    Route::post('/logout', [AuthController::class, 'logout']);
});
