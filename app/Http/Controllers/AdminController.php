<?php

namespace App\Http\Controllers;

use App\Imports\JSONImport;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function show()
    {
        return Redirect::route('admin-data');
    }

    public function showData()
    {
        return Inertia::render('Admin/Data');
    }

    public function showLogin()
    {
        return Inertia::render('Admin/Login');
    }

    public function login()
    {
        $credentials = request()->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials)) {
            request()->session()->regenerate();
            return Redirect::intended('/admin/data');
        }
        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ]);
    }

    public function logout()
    {
        Auth::logout();
        request()->session()->invalidate();
        request()->session()->regenerateToken();
        return Redirect::route('login');
    }

    public function import()
    {
        $attributes = request()->validate([
            'import' => ['required', 'mimes:json'],
        ]);
        $file = $attributes['import'];
        DB::transaction(function () use ($file) {
            $import = new JSONImport($file);
            $import->run();
        });
        return Redirect::route('admin-data');
    }

    public function exportPlans()
    {
        $exitCode = Artisan::call('export:plans');
        return response()->json(['code' => $exitCode]);
    }
}
