<?php

namespace App\Http\Controllers\API\Message;

use App\Events\MessageSent;
use App\Http\Controllers\Controller;
use App\Http\Resources\MessageResource;
use App\Models\Chat;
use App\Models\Message;
use App\Models\FileUpload;
use App\Services\FileUploadService;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MessageController extends Controller
{
    protected $fileUploadService;
    protected $notificationService;
    
    public function __construct(FileUploadService $fileUploadService, NotificationService $notificationService)
    {
        $this->fileUploadService = $fileUploadService;
        $this->notificationService = $notificationService;
        $this->middleware('auth:sanctum');
    }
    
    public function index(Request $request, Chat $chat)
    {
        $userId = $request->user()->id;
        
        // Check if user is part of this chat
        if (!$chat->hasActiveParticipant($userId)) {
            return response()->json(['message' => 'You do not have permission to view messages in this chat'], 403);
        }
        
        $messages = $chat->messages()->with(['user', 'attachments'])->latest()->paginate(20);
        
        // Mark chat as read for this user
        $participant = $chat->participants()->where('user_id', $userId)->first();
        if ($participant) {
            $participant->update(['last_read_at' => now()]);
        }
        
        return MessageResource::collection($messages);
    }
    
    public function store(Request $request, Chat $chat)
    {
        $userId = $request->user()->id;
        
        // Check if user is part of this chat
        if (!$chat->hasActiveParticipant($userId)) {
            return response()->json(['message' => 'You do not have permission to send messages in this chat'], 403);
        }
        
        $validator = Validator::make($request->all(), [
            'content' => 'nullable|string|max:10000',
            'attachments.*' => 'nullable|file|max:10240', // 10MB max
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        // Ensure at least content or attachment is provided
        if (empty($request->content) && !$request->hasFile('attachments')) {
            return response()->json(['message' => 'Message must have content or attachment'], 422);
        }
        
        // Create the message
        $message = $chat->messages()->create([
            'user_id' => $userId,
            'content' => $request->content ?? '',
        ]);
        
        // Handle attachments if provided
        $attachments = [];
        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $index => $file) {
                try {
                    $fileUpload = $this->fileUploadService->uploadFile(
                        $file,
                        $userId,
                        'message_attachment'
                    );
                    
                    $attachment = $message->attachments()->create([
                        'file_name' => $file->getClientOriginalName(),
                        'file_path' => $fileUpload->file_path,
                        'file_size' => $file->getSize(),
                        'file_type' => $file->getMimeType(),
                    ]);
                    
                    $attachments[] = $attachment;
                } catch (\Exception $e) {
                    // Log the error but continue with message creation
                    \Log::error('Failed to upload attachment: ' . $e->getMessage());
                }
            }
        }
        
        // Update the chat's last_message_at timestamp
        $chat->update(['last_message_at' => now()]);
        
        // Load attachments for the message
        $message->load(['user', 'attachments']);
        
        // Broadcast the message if event broadcasting is set up
        try {
            event(new MessageSent($message));
        } catch (\Exception $e) {
            \Log::error('Failed to broadcast message: ' . $e->getMessage());
        }
        
        // Send notification to other participants
        $otherParticipants = $chat->participants()
            ->where('user_id', '!=', $userId)
            ->whereNull('left_at')
            ->get();
            
        foreach ($otherParticipants as $participant) {
            try {
                $this->notificationService->sendNotification(
                    $participant->user_id,
                    'new_message',
                    "New message from {$request->user()->name}",
                    [
                        'chat_id' => $chat->id, 
                        'message_id' => $message->id,
                        'sender_name' => $request->user()->name
                    ]
                );
            } catch (\Exception $e) {
                \Log::error('Failed to send notification: ' . $e->getMessage());
            }
        }
        
        return new MessageResource($message);
    }
    
    public function markAsRead(Request $request, Chat $chat)
    {
        $userId = $request->user()->id;
        
        // Check if user is part of this chat
        if (!$chat->hasActiveParticipant($userId)) {
            return response()->json(['message' => 'You do not have permission to access this chat'], 403);
        }
        
        // Update the user's last_read_at timestamp for this chat
        $participant = $chat->participants()->where('user_id', $userId)->first();
        if ($participant) {
            $participant->update(['last_read_at' => now()]);
        }
        
        return response()->json([
            'success' => true,
            'message' => 'Chat marked as read'
        ]);
    }
    
    public function destroy(Request $request, Chat $chat, Message $message)
    {
        $userId = $request->user()->id;
        
        // Check if user is the sender of this message
        if ($message->user_id !== $userId) {
            return response()->json(['message' => 'You do not have permission to delete this message'], 403);
        }
        
        // Delete message attachments if they exist
        foreach ($message->attachments as $attachment) {
            try {
                // Find the file upload record if available
                $fileUpload = FileUpload::where('file_path', $attachment->file_path)->first();
                
                if ($fileUpload) {
                    $this->fileUploadService->deleteFileUpload($fileUpload);
                }
                
                // Delete the attachment record
                $attachment->delete();
            } catch (\Exception $e) {
                // Log the error but continue with message deletion
                \Log::error('Failed to delete message attachment: ' . $e->getMessage());
            }
        }
        
        $message->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'Message deleted successfully'
        ]);
    }
}
