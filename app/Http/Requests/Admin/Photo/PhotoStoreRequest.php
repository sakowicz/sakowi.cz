<?php

namespace App\Http\Requests\Admin\Photo;

use Illuminate\Foundation\Http\FormRequest;

class PhotoStoreRequest extends FormRequest
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
            'image' => 'required|image',
            'image_name' => 'required|alpha_dash', // @todo image_name should be unique
            'is_on_homepage' => 'boolean',
        ];
    }
}
