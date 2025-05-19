<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Document;
use App\Models\FileUpload;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\StreamedResponse;

class StorageController extends Controller
{
    /**
     * Serve a file from storage with authentication check
     *
     * @param string $path The file path
     * @return \Illuminate\Http\Response
     */
    public function getFile($path)
    {
        // Check authentication
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized access'], 401);
        }
        
        // Replace 'private/' with '' to get the actual path
        $actualPath = str_replace('private/', '', $path);
        
        // Check if it's a document file
        $fileUpload = FileUpload::where('file_path', $path)
            ->orWhere('file_path', $actualPath)
            ->first();
            
        if ($fileUpload) {
            // Check if this file is linked to a document that requires authorization
            $document = Document::whereHas('fileUpload', function($query) use ($fileUpload) {
                $query->where('id', $fileUpload->id);
            })->first();
            
            if ($document && !$document->is_approved && Auth::id() !== $document->user_id && !Auth::user()->hasRole(['admin', 'moderator'])) {
                return response()->json(['message' => 'You do not have permission to access this file'], 403);
            }
        }
        
        // Check if file exists
        if (!Storage::exists($actualPath) && !Storage::exists($path)) {
            return response()->json(['message' => 'File not found'], 404);
        }
        
        $filePath = Storage::exists($actualPath) ? $actualPath : $path;
        
        // Get file metadata
        $mimeType = Storage::mimeType($filePath);
        $size = Storage::size($filePath);
        $fileName = basename($filePath);
        
        // Return the file as a streamed download
        return new StreamedResponse(function () use ($filePath) {
            $stream = Storage::readStream($filePath);
            fpassthru($stream);
            if (is_resource($stream)) {
                fclose($stream);
            }
        }, 200, [
            'Content-Type' => $mimeType,
            'Content-Disposition' => 'attachment; filename="' . $fileName . '"',
            'Content-Length' => $size,
        ]);
    }

    /**
     * Preview a file from storage with authentication check
     *
     * @param string $path The file path
     * @return \Illuminate\Http\Response
     */
    public function previewFile($path)
    {
        // Check authentication
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized access'], 401);
        }
        
        // Replace 'private/' with '' to get the actual path
        $actualPath = str_replace('private/', '', $path);
        
        // Check if it's a document file
        $fileUpload = FileUpload::where('file_path', $path)
            ->orWhere('file_path', $actualPath)
            ->first();
            
        if ($fileUpload) {
            // Check if this file is linked to a document that requires authorization
            $document = Document::whereHas('fileUpload', function($query) use ($fileUpload) {
                $query->where('id', $fileUpload->id);
            })->first();
            
            if ($document && !$document->is_approved && Auth::id() !== $document->user_id && !Auth::user()->hasRole(['admin', 'moderator'])) {
                return response()->json(['message' => 'You do not have permission to access this file'], 403);
            }
        }
        
        // Check if file exists
        if (!Storage::exists($actualPath) && !Storage::exists($path)) {
            return response()->json(['message' => 'File not found'], 404);
        }
        
        $filePath = Storage::exists($actualPath) ? $actualPath : $path;
        
        // Check if the file is a PDF, image, or other previewable file type
        $mimeType = Storage::mimeType($filePath);
        if (!in_array($mimeType, ['application/pdf', 'image/jpeg', 'image/png', 'image/gif', 'image/webp'])) {
            return response()->json(['message' => 'File type not supported for preview'], 400);
        }
        
        // Get file metadata
        $size = Storage::size($filePath);
        
        // Return the file for inline display
        return new StreamedResponse(function () use ($filePath) {
            $stream = Storage::readStream($filePath);
            fpassthru($stream);
            if (is_resource($stream)) {
                fclose($stream);
            }
        }, 200, [
            'Content-Type' => $mimeType,
            'Content-Disposition' => 'inline',
            'Content-Length' => $size,
        ]);
    }
    
    /**
     * Check if the current user has access to a file
     * 
     * @param string $path The file path
     * @return bool
     */
    private function userHasAccessToFile($path)
    {
        // Admin and moderators have access to all files
        if (Auth::user()->hasRole(['admin', 'moderator'])) {
            return true;
        }
        
        // Check if it's a document file
        $fileUpload = FileUpload::where('file_path', $path)->first();
        
        if (!$fileUpload) {
            // If not a tracked file, only admins have access (already handled above)
            return false;
        }
        
        // If the user is the owner of the file, they have access
        if ($fileUpload->user_id === Auth::id()) {
            return true;
        }
        
        // Check if this file is linked to a document
        $document = Document::whereHas('fileUpload', function($query) use ($fileUpload) {
            $query->where('id', $fileUpload->id);
        })->first();
        
        if (!$document) {
            // If not linked to a document, only owner has access (already handled above)
            return false;
        }
        
        // If the document is approved, everyone has access
        if ($document->is_approved) {
            return true;
        }
        
        // Otherwise, only the owner, admin, and moderators have access
        return $document->user_id === Auth::id();
    }
}
