<?php

namespace App\Services;

use App\Models\FileUpload;
use App\Models\Document;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FileUploadService
{
    protected $googleDriveService;
    protected $minioService;
    protected $lockTimeout = 30; // Thời gian khóa tối đa (giây)
    protected $defaultStorage;

    /**
     * Tạo một instance mới của service.
     */
    public function __construct(GoogleDriveService $googleDriveService, MinIOService $minioService)
    {
        $this->googleDriveService = $googleDriveService;
        $this->minioService = $minioService;
        $this->defaultStorage = config('filesystems.default_storage', 'local');
    }

    /**
     * Upload a file and create a FileUpload record
     *
     * @param UploadedFile|null $file The file to upload
     * @param int $userId User ID
     * @param string|null $type Type of upload (document, avatar, etc.)
     * @param string|null $modelId Model ID for morphable relation
     * @param string|null $storageType Storage type (local, google_drive, minio)
     * @return FileUpload
     */
    public function uploadFile(?UploadedFile $file, int $userId, ?string $type = null, ?string $modelId = null, ?string $storageType = 'local')
    {
        if (!$file) {
            throw new \Exception('No file provided');
        }

        // Calculate the file hash
        $fileHash = hash_file('md5', $file->getPathname());
        
        // Check if this file already exists based on hash
        $existingUpload = FileUpload::where('file_hash', $fileHash)->where('status', 'completed')->first();
        
        // If we already have this file, we'll create a new record but reuse the existing file
        if ($existingUpload) {
            // Create a new upload record that references the same file
            $fileUpload = new FileUpload([
                'user_id' => $userId,
                'original_filename' => $file->getClientOriginalName(),
                'stored_filename' => $existingUpload->stored_filename,
                'file_path' => $existingUpload->file_path,
                'file_type' => $file->getMimeType(),
                'file_size' => $file->getSize(),
                'file_hash' => $fileHash,
                'status' => 'completed',
                'storage_type' => $storageType,
            ]);
            
            $fileUpload->save();
            
            return $fileUpload;
        }
        
        // Create a unique filename
        $storedFilename = Str::uuid() . '.' . $file->getClientOriginalExtension();
        
        // Define folder path based on user and type - store in private directory
        $folderPath = 'private/uploads/' . $userId;
        if ($type) {
            $folderPath .= '/' . $type;
        }
        
        // Store the file
        $filePath = $file->storeAs($folderPath, $storedFilename);
        
        if (!$filePath) {
            throw new \Exception('Failed to store file');
        }
        
        // Create file upload record
        $fileUpload = new FileUpload([
            'user_id' => $userId,
            'original_filename' => $file->getClientOriginalName(),
            'stored_filename' => $storedFilename,
            'file_path' => $filePath,
            'file_type' => $file->getMimeType(),
            'file_size' => $file->getSize(),
            'file_hash' => $fileHash,
            'status' => 'completed',
            'storage_type' => $storageType,
        ]);
        
        $fileUpload->save();
        
        return $fileUpload;
    }
    
    /**
     * Check if a file exists based on its hash
     *
     * @param UploadedFile $file File to check
     * @return array Information about the file existence
     */
    public function checkFileExists(UploadedFile $file)
    {
        $fileHash = hash_file('md5', $file->getPathname());
        
        $existingUpload = FileUpload::where('file_hash', $fileHash)
            ->where('status', 'completed')
            ->first();
            
        if (!$existingUpload) {
            return [
                'exists' => false
            ];
        }
        
        // Find the document associated with this file
        $document = Document::whereHas('fileUpload', function($query) use ($existingUpload) {
            $query->where('id', $existingUpload->id);
        })->first();
        
        return [
            'exists' => true,
            'file_upload_id' => $existingUpload->id,
            'document_id' => $document ? $document->id : null,
            'document' => $document
        ];
    }
    
    /**
     * Delete a file upload and associated file
     *
     * @param FileUpload $fileUpload The FileUpload record to delete
     * @return bool Success status
     */
    public function deleteFileUpload(FileUpload $fileUpload)
    {
        // Count how many other uploads reference the same file
        $referenceCount = FileUpload::where('file_hash', $fileUpload->file_hash)
            ->where('id', '!=', $fileUpload->id)
            ->count();
            
        // Only delete the physical file if no other uploads reference it
        if ($referenceCount === 0 && Storage::exists($fileUpload->file_path)) {
            Storage::delete($fileUpload->file_path);
        }
        
        // Delete the record
        return $fileUpload->delete();
    }
    
    /**
     * Handle chunked file uploads
     * 
     * @param UploadedFile $chunk The chunk file
     * @param string $uploadSessionId The upload session ID
     * @param int $chunkIndex The index of the current chunk
     * @param int $totalChunks The total number of chunks
     * @param int $userId The ID of the user uploading the file
     * @return FileUpload|null The FileUpload model if complete, null if still in progress
     */
    public function uploadFileChunk(
        UploadedFile $chunk, 
        string $uploadSessionId, 
        int $chunkIndex, 
        int $totalChunks, 
        int $userId
    ): ?FileUpload
    {
        // Get or create upload session
        $fileUpload = FileUpload::firstOrCreate(
            ['upload_session_id' => $uploadSessionId],
            [
                'user_id' => $userId,
                'original_filename' => request()->input('filename'),
                'file_type' => request()->input('filetype'),
                'file_size' => request()->input('filesize'),
                'chunks_total' => $totalChunks,
                'chunks_received' => 0,
                'status' => 'pending',
            ]
        );
        
        // Create temp directory for chunks
        $tempDir = storage_path("app/chunks/{$uploadSessionId}");
        if (!file_exists($tempDir)) {
            mkdir($tempDir, 0755, true);
        }
        
        // Save chunk
        $chunkPath = "{$tempDir}/chunk_{$chunkIndex}";
        file_put_contents($chunkPath, file_get_contents($chunk));
        
        // Update chunks received count
        $fileUpload->increment('chunks_received');
        
        // Check if all chunks are received
        if ($fileUpload->chunks_received >= $fileUpload->chunks_total) {
            // Combine chunks
            $finalFilePath = $this->combineChunks($fileUpload, $tempDir, $totalChunks);
            
            // Update FileUpload record
            $fileUpload->update([
                'file_path' => $finalFilePath,
                'status' => 'completed',
                'file_hash' => md5_file(storage_path("app/{$finalFilePath}")),
            ]);
            
            // Clean up temp directory
            $this->cleanupChunks($tempDir);
            
            return $fileUpload;
        }
        
        return null;
    }
    
    /**
     * Combine chunks into a single file
     * 
     * @param FileUpload $fileUpload The FileUpload record
     * @param string $tempDir The temporary directory with chunks
     * @param int $totalChunks The total number of chunks
     * @return string The path to the combined file
     */
    private function combineChunks(FileUpload $fileUpload, string $tempDir, int $totalChunks): string
    {
        // Generate the final path
        $extension = pathinfo($fileUpload->original_filename, PATHINFO_EXTENSION);
        $finalFilename = Str::uuid() . ".{$extension}";
        $finalDir = "uploads/{$fileUpload->user_id}";
        $finalPath = "{$finalDir}/{$finalFilename}";
        
        // Ensure directory exists
        if (!Storage::disk('local')->exists($finalDir)) {
            Storage::disk('local')->makeDirectory($finalDir);
        }
        
        // Create file handle for the final file
        $finalFile = fopen(storage_path("app/{$finalPath}"), 'wb');
        
        // Append each chunk
        for ($i = 0; $i < $totalChunks; $i++) {
            $chunkPath = "{$tempDir}/chunk_{$i}";
            $chunkContents = file_get_contents($chunkPath);
            fwrite($finalFile, $chunkContents);
        }
        
        // Close file handle
        fclose($finalFile);
        
        // Update stored filename
        $fileUpload->update([
            'stored_filename' => $finalFilename,
        ]);
        
        return $finalPath;
    }
    
    /**
     * Clean up temporary chunk files
     * 
     * @param string $tempDir The temporary directory with chunks
     * @return void
     */
    private function cleanupChunks(string $tempDir): void
    {
        // Remove all files in the directory
        $files = glob("{$tempDir}/*");
        foreach ($files as $file) {
            if (is_file($file)) {
                unlink($file);
            }
        }
        
        // Remove the directory
        if (is_dir($tempDir)) {
            rmdir($tempDir);
        }
    }
    
    /**
     * Handle interrupted uploads
     * 
     * @param string $uploadId Upload session ID
     * @return array Status info
     */
    public function handleInterruptedUpload($uploadId)
    {
        $fileUpload = $this->getFileBySessionId($uploadId);
        
        if (!$fileUpload) {
            return null;
        }
        
        return [
            'upload_id' => $uploadId,
            'chunks_received' => $fileUpload->chunks_received,
            'chunks_total' => $fileUpload->chunks_total,
            'status' => $fileUpload->status
        ];
    }
    
    /**
     * Get file upload by session ID
     * 
     * @param string $uploadId Upload session ID
     * @return FileUpload|null
     */
    public function getFileBySessionId($uploadId)
    {
        return FileUpload::where('upload_session_id', $uploadId)->first();
    }
}
