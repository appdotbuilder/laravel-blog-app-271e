<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePostRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:posts,slug',
            'excerpt' => 'nullable|string|max:500',
            'content' => 'required|string',
            'featured_image' => 'nullable|string|max:255',
            'type' => 'required|in:article,news,event,lecture',
            'status' => 'required|in:draft,published,archived',
            'published_at' => 'nullable|date',
            'meta_data' => 'nullable|array',
            'category_id' => 'required|exists:categories,id',
            'tag_ids' => 'nullable|array',
            'tag_ids.*' => 'exists:tags,id',
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'title.required' => 'Post title is required.',
            'content.required' => 'Post content is required.',
            'type.required' => 'Post type is required.',
            'type.in' => 'Post type must be one of: article, news, event, lecture.',
            'status.required' => 'Post status is required.',
            'status.in' => 'Post status must be one of: draft, published, archived.',
            'category_id.required' => 'Post category is required.',
            'category_id.exists' => 'Selected category does not exist.',
            'tag_ids.*.exists' => 'One or more selected tags do not exist.',
        ];
    }
}