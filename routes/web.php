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
    
    // Check if this is an image or document
    $mimeType = File::mimeType($fullPath);
    
    // For security, only allow specific file types to be accessed directly
    $allowedMimeTypes = [
        'image/jpeg', 'image/png', 'image/gif', 'image/webp',
        'application/pdf', 'image/svg+xml'
    ];
    
    if (!in_array($mimeType, $allowedMimeTypes)) {
        abort(403, 'File type not allowed for direct access');
    }
    
    $contents = File::get($fullPath);
    
    return response($contents, 200)
        ->header('Content-Type', $mimeType);
})->where('path', '.*');