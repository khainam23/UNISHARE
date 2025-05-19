<?php

namespace App\Http\Controllers\API\Message;

use App\Http\Controllers\Controller;
use App\Http\Resources\ChatResource;
use App\Models\Chat;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ChatController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }
    
    public function index(Request $request)
    {
        $userId = $request->user()->id;
        
        // Get chats where the user is a participant
        $chats = Chat::whereHas('participants', function($query) use ($userId) {
            $query->where('user_id', $userId)->whereNull('left_at');
        })->with(['participants.user', 'lastMessage'])->latest('updated_at')->paginate(15);
        
        return ChatResource::collection($chats);
    }
    
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        $currentUserId = $request->user()->id;
        $otherUserId = $request->user_id;
        
        // Check if a direct chat already exists between these users
        $chat = Chat::where('is_group', false)
            ->whereHas('participants', function($query) use ($currentUserId) {
                $query->where('user_id', $currentUserId)->whereNull('left_at');
            })
            ->whereHas('participants', function($query) use ($otherUserId) {
                $query->where('user_id', $otherUserId)->whereNull('left_at');
            })
            ->first();
        
        if ($chat) {
            return new ChatResource($chat->load('participants.user'));
        }
        
        // Create a new chat
        $chat = Chat::create([
            'name' => null, // For direct chats, name can be null
            'type' => 'direct',
            'created_by' => $currentUserId,
            'is_group' => false,
            'last_message_at' => now(),
        ]);
        
        // Add both users as participants
        $chat->addParticipant($currentUserId, true); // Current user as admin
        $chat->addParticipant($otherUserId, false);
        
        return new ChatResource($chat->load('participants.user'));
    }
    
    public function show(Chat $chat)
    {
        $userId = request()->user()->id;
        
        // Check if user is part of this chat
        if (!$chat->hasActiveParticipant($userId)) {
            return response()->json(['message' => 'You do not have permission to view this chat'], 403);
        }
        
        return new ChatResource($chat->load(['participants.user', 'lastMessage']));
    }
    
    public function destroy(Request $request, Chat $chat)
    {
        $userId = $request->user()->id;
        
        // Check if user is part of this chat
        if (!$chat->hasActiveParticipant($userId)) {
            return response()->json(['message' => 'You do not have permission to delete this chat'], 403);
        }
        
        // For a group chat, just remove the user as a participant
        if ($chat->is_group) {
            $chat->removeParticipant($userId);
            return response()->json(['message' => 'You have left the chat']);
        }
        
        // For a direct chat, delete all messages in the chat
        $chat->messages()->delete();
        
        // Delete the chat
        $chat->delete();
        
        return response()->json(['message' => 'Chat deleted successfully']);
    }
    
    /**
     * Get unread message counts for all user's chats
     */
    public function getUnreadCounts(Request $request)
    {
        $userId = $request->user()->id;
        
        // Get chats where the user is a participant
        $chats = Chat::whereHas('participants', function($query) use ($userId) {
            $query->where('user_id', $userId)->whereNull('left_at');
        })->get();
        
        $unreadCounts = [];
        $totalUnread = 0;
        
        foreach ($chats as $chat) {
            $unreadCount = $chat->unreadCount($userId);
            $unreadCounts[$chat->id] = $unreadCount;
            $totalUnread += $unreadCount;
        }
        
        return response()->json([
            'success' => true,
            'data' => [
                'chats' => $unreadCounts,
                'total' => $totalUnread
            ]
        ]);
    }
}
