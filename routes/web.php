<?php

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Inertia\Inertia;

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
Route::name('login')->get('/login', '\\'.Route::getRoutes()->getByName('shibboleth-login')->getActionName());

Route::middleware('auth')->group(function () {
    Route::get('/', function () {
        return Inertia::render('Home', []);
    })->name('home');
});
