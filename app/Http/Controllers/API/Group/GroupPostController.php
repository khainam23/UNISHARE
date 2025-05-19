<?php

namespace App\Http\Controllers\API\Group;

use App\Http\Controllers\Controller;
use App\Http\Resources\PostResource;
use App\Models\Group;
use App\Models\Post;
use App\Services\FileUploadService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class GroupPostController extends Controller
{
    protected $fileUploadService;
    
    public function __construct(FileUploadService $fileUploadService)
    {
        $this->fileUploadService = $fileUploadService;
        $this->middleware('auth:sanctum');
    }
    
    /**
     * Get all posts for a specific group
     * 
     * @param Request $request
     * @param Group $group
     * @return \Illuminate\Http\JsonResponse
     */
    public function getGroupPosts(Request $request, Group $group)
    {
        // Check if user can view posts in this group
        if ($group->is_private) {
            $isMember = $group->members()->where('user_id', $request->user()->id)->exists();
            
            if (!$isMember && !$request->user()->hasRole(['admin', 'moderator'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'You do not have permission to view posts in this group'
                ], 403);
            }
        }
        
        // Get posts with pagination
        $posts = $group->posts()
            ->with(['author', 'group', 'attachments', 'likes'])
            ->withCount(['comments', 'likes'])
            ->orderBy('created_at', 'desc')
            ->paginate($request->input('per_page', 10));
        
        // Check if the user has liked each post
        $posts->getCollection()->transform(function ($post) use ($request) {
            $post->is_liked = $post->likes()->where('user_id', $request->user()->id)->exists();
            $post->can_edit = $post->user_id === $request->user()->id || $request->user()->hasRole(['admin', 'moderator']);
            $post->can_delete = $post->user_id === $request->user()->id || $request->user()->hasRole(['admin', 'moderator']);
            return $post;
        });
        
        return response()->json([
            'success' => true,
            'data' => PostResource::collection($posts),
            'meta' => [
                'current_page' => $posts->currentPage(),
                'last_page' => $posts->lastPage(),
                'per_page' => $posts->perPage(),
                'total' => $posts->total()
            ]
        ]);
    }
    
    /**
     * Create a new post in a group
     * 
     * @param Request $request
     * @param Group $group
     * @return \Illuminate\Http\JsonResponse
     */
    public function createGroupPost(Request $request, Group $group)
    {
        // Check if user is a member of the group
        $isMember = $group->members()->where('user_id', $request->user()->id)->exists();
        
        if (!$isMember && !$request->user()->hasRole(['admin', 'moderator'])) {
            return response()->json([
                'success' => false,
                'message' => 'You must be a member of this group to create posts'
            ], 403);
        }
        
        // Validate request
        $validator = Validator::make($request->all(), [
            'content' => 'required_without:attachments|string|nullable',
            'attachments' => 'nullable|array',
            'attachments.*' => 'file|max:20480' // 20MB max file size
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }
        
        // Create the post
        $post = new Post([
            'content' => $request->input('content'),
            'user_id' => $request->user()->id,
            'group_id' => $group->id
        ]);
        
        $post->save();
        
        // Handle attachments
        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                try {
                    $fileUpload = $this->fileUploadService->uploadFile(
                        $file,
                        $request->user()->id,
                        'post_attachment'
                    );
                    
                    // Create attachment record
                    $post->attachments()->create([
                        'file_upload_id' => $fileUpload->id,
                        'name' => $file->getClientOriginalName(),
                        'type' => $file->getClientMimeType(),
                        'size' => $file->getSize()
                    ]);
                } catch (\Exception $e) {
                    // Log error but continue processing other attachments
                    \Log::error('Failed to upload post attachment: ' . $e->getMessage());
                }
            }
        }
        
        // Get the post with relationships for the response
        $post->load(['author', 'group', 'attachments']);
        $post->comments_count = 0;
        $post->likes_count = 0;
        $post->is_liked = false;
        $post->can_edit = true;
        $post->can_delete = true;
        
        return response()->json([
            'success' => true,
            'message' => 'Post created successfully',
            'data' => new PostResource($post)
        ], 201);
    }
}
