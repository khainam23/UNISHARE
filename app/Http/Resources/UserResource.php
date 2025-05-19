<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
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
            'name' => $this->name,
            'email' => $this->when($request->user() && $request->user()->id === $this->id, $this->email),
            'bio' => $this->bio,
            'avatar' => $this->avatar ? url('storage/' . $this->avatar) : null,
            'university' => $this->university,
            'department' => $this->department,
            'student_id' => $this->student_id,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            
            // Only include roles if they're loaded
            'roles' => RoleResource::collection($this->whenLoaded('roles')),
        ];
    }
}
