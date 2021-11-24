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

Route::get('register', function () {
    return Inertia::render('Register');
})->name('register');

Route::post('register', function (Request $request) {
    $attributes = $request->validate([
        'name' => ['required'],
        'email' => ['required', 'email'],
        'password' => ['required']
    ]);

    User::create($attributes);

    return redirect()->route('home');
});

Route::get('login', function () {
    return Inertia::render('Login');
})->name('login');

Route::post('login', function (Request $request) {
    $credentials = $request->validate([
        'name' => ['required'],
        'password' => ['required']
    ]);

    if (Auth::attempt($credentials)) {
        $request->session()->regenerate();

        return redirect()->intended();
    }

    return redirect()->back()->withErrors([
        'name' => 'The provided credentials do not match our records'
    ]);
});

Route::middleware('auth')->group(function () {
    Route::post('logout', function () {
        Auth::logout();
        return redirect()->route('login');
    });
    Route::get('/', function () {
        return Inertia::render('Home', []);
    })->name('home');
});
