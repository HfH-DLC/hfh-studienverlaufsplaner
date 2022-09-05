<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateFocusCreditRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'focusCredits' => 'present',
            'focusCredits.*' => 'array',
            'focusCredits.*.focusSelectionId' =>  'required|exists:focus_selections,id',
            'focusCredits.*.moduleIds' =>  'present|array',
            'focusCredits.*.moduleIds.*' => 'required|exists:modules,id',
            'tourCompleted' => 'required|boolean'
        ];
    }
}
