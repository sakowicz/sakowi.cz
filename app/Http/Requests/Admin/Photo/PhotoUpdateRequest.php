<?php

namespace App\Http\Requests\Admin\Photo;

use Illuminate\Foundation\Http\FormRequest;

class PhotoUpdateRequest extends FormRequest
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
            'is_on_homepage' => 'boolean',
        ];
    }
}
