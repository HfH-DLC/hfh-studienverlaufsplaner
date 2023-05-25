<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ModuleFilterController;
use App\Http\Controllers\PlanController;
use App\Http\Controllers\PlanerController;
use App\Http\Controllers\SettingsController;
use Illuminate\Support\Facades\Route;


/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', [HomeController::class, 'show']);

Route::get('/admin/login', [AdminController::class, 'showLogin'])->name('login');
Route::post('/admin/login', [AdminController::class, 'login']);

Route::middleware('auth')->prefix('admin')->group(function () {
    Route::get('/', [AdminController::class, 'show'])->name('admin');
    Route::post('/logout', [AdminController::class, 'logout']);
    Route::get('/data', [AdminController::class, 'showData'])->name('admin-data');
    Route::post('/data', [AdminController::class, 'import']);
});

Route::prefix('/{planer:id}')->scopeBindings()->group(function () {
    Route::get('/', [PlanerController::class, 'show'])->name('planer');
    Route::get('/modulfilter', [ModuleFilterController::class, 'show'])->name('modulefilter');
    Route::post('/plans', [PlanController::class, 'store']);
    Route::get('/{plan:slug}', [PlanController::class, 'show'])->name('plan');
    Route::get('/{plan:slug}/anrechnung', [PlanController::class, 'showCredit'])->name('plan-credit');
    Route::put('/{plan:slug}/anrechnung', [PlanController::class, 'updateCredit']);
    Route::get('/{plan:slug}/einstellungen', [SettingsController::class, 'show'])->name('settings');
    Route::put('/{plan:slug}/einstellungen', [SettingsController::class, 'update'])->name('settings');
    Route::get('/{plan:slug}/zeitplan', [PlanController::class, 'showSchedule'])->name('plan-schedule');
    Route::put('/{plan:slug}/zeitplan', [PlanController::class, 'updateSchedule']);
});


Route::get('/.well-known/acme-challenge/{token}', function (string $token) {
    return \Illuminate\Support\Facades\Storage::get('public/.well-known/acme-challenge/' . $token);
});
