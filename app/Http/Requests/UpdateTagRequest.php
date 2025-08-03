<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTagRequest extends FormRequest
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
            'name' => 'required|string|max:255|unique:tags,name,' . $this->route('tag')->id,
            'slug' => 'nullable|string|max:255|unique:tags,slug,' . $this->route('tag')->id,
            'color' => 'required|string|regex:/^#[0-9A-Fa-f]{6}$/',
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
            'name.required' => 'Tag name is required.',
            'name.unique' => 'A tag with this name already exists.',
            'color.required' => 'Tag color is required.',
            'color.regex' => 'Tag color must be a valid hex color code.',
        ];
    }
}