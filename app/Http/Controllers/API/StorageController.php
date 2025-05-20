<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use App\Models\Document;

class StorageController extends Controller
{
    /**
     * Get a file from storage with authentication
     */
    public function getFile(Request $request, $path)
    {
        // Check if user is authenticated
        if (!Auth::check()) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }
        
        $fullPath = storage_path('app/public/' . $path);
        
        if (!File::exists($fullPath)) {
            return response()->json(['error' => 'File not found'], 404);
        }
        
        // Special case for all public directories
        $publicDirectories = ['blog', 'courses', 'documents', 'avatars'];
        $pathParts = explode('/', $path);
        
        if (in_array($pathParts[0], $publicDirectories)) {
            // These directories have public content that any authenticated user can access
            $mimeType = File::mimeType($fullPath);
            $contents = File::get($fullPath);
            
            return response($contents, 200)
                ->header('Content-Type', $mimeType);
        }
        
        // For non-public files, check permissions
        $documentId = null;
        
        // Try to extract document ID from path if it follows a pattern
        if (count($pathParts) >= 2 && strpos($path, 'uploads/documents/') === 0) {
            $documentId = intval($pathParts[2]);
        }
        
        if ($documentId) {
            $document = Document::find($documentId);
            if ($document && !$this->userCanAccessDocument($request->user(), $document)) {
                return response()->json(['error' => 'Unauthorized access'], 403);
            }
        }
        
        $mimeType = File::mimeType($fullPath);
        $contents = File::get($fullPath);
        
        return response($contents, 200)
            ->header('Content-Type', $mimeType);
    }
    
    /**
     * Preview a file (typically for documents)
     */
    public function previewFile(Request $request, $path)
    {
        $fullPath = storage_path('app/public/' . $path);
        
        if (!File::exists($fullPath)) {
            return response()->json(['error' => 'File not found'], 404);
        }
        
        $mimeType = File::mimeType($fullPath);
        
        // For security, we only preview certain file types
        $previewableMimeTypes = [
            'application/pdf',
            'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
            'text/plain', 'text/html', 'text/css', 'text/javascript'
        ];
        
        if (!in_array($mimeType, $previewableMimeTypes)) {
            return response()->json(['error' => 'File type not previewable'], 403);
        }
        
        $contents = File::get($fullPath);
        
        return response($contents, 200)
            ->header('Content-Type', $mimeType);
    }
    
    /**
     * Check if a user can access a document
     */
    private function userCanAccessDocument($user, $document)
    {
        // If document is public, anyone can access
        if ($document->is_public) {
            return true;
        }
        
        // If user is document owner
        if ($user->id === $document->user_id) {
            return true;
        }
        
        // If user is admin or moderator
        if ($user->hasRole(['admin', 'moderator'])) {
            return true;
        }
        
        // If document belongs to a group and user is member of that group
        if ($document->group_id) {
            return $user->groups()->where('group_id', $document->group_id)->exists();
        }
        
        return false;
    }
}
