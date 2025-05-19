<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\File;
use Laravel\Sanctum\Http\Controllers\CsrfCookieController;

Route::get('/', function () {
    return view('welcome');
});

// Make sure Sanctum routes are registered
Route::get('/sanctum/csrf-cookie', [CsrfCookieController::class, 'show']);

// Route to handle storage files
Route::get('/storage/{path}', function($path) {
    // This is a public-facing route, so we should perform validation
    // to ensure users can only access allowed files
    $fullPath = storage_path('app/public/' . $path);
    
    if (!File::exists($fullPath)) {
        abort(404, 'File not found');
    }
    
    $mimeType = File::mimeType($fullPath);
    $contents = File::get($fullPath);
    
    return response($contents, 200)
        ->header('Content-Type', $mimeType);
})->where('path', '.*');