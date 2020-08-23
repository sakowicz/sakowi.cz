<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class PhotoRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'title' => 'required_with:is_on_homepage',
            'subtitle' => 'required_with:is_on_homepage',
            'image' => 'required|string',
            'is_on_homepage' => 'boolean',
        ];
    }
}
