<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class PostResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'content' => $this->content,
            'user_id' => $this->user_id,
            'group_id' => $this->group_id,
            'is_pinned' => $this->is_pinned,
            'is_announcement' => $this->is_announcement,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            
            // Include related data
            'author' => new UserResource($this->whenLoaded('author')),
            'group' => new GroupResource($this->whenLoaded('group')),
            'attachments' => AttachmentResource::collection($this->whenLoaded('attachments')),
            
            // Include counts
            'comments_count' => $this->when(isset($this->comments_count), $this->comments_count),
            'likes_count' => $this->when(isset($this->likes_count), $this->likes_count),
            
            // User specific attributes
            'is_liked' => $this->when(isset($this->is_liked), $this->is_liked),
            'can_edit' => $this->when(isset($this->can_edit), $this->can_edit),
            'can_delete' => $this->when(isset($this->can_delete), $this->can_delete),
        ];
    }
}
