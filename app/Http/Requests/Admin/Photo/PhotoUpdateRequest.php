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
            'title' => 'required_if:is_on_homepage,1',
            'subtitle' => 'required_if:is_on_homepage,1',
            'is_on_homepage' => 'boolean',
        ];
    }
}
