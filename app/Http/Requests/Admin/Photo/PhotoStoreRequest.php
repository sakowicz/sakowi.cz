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
            'title' => 'required_if:is_on_homepage,1',
            'subtitle' => 'required_if:is_on_homepage,1',
            'image' => 'required|image',
            'image_name' => 'required|alpha_dash', // @todo image_name should be unique
            'is_on_homepage' => 'boolean',
        ];
    }
}
