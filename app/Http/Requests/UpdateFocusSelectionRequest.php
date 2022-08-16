<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateFocusSelectionRequest extends FormRequest
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
            'focusSelections' => 'required|array|min:1',
            'focusSelections.*.focus' => 'required|string|exists:foci,id',
            'focusSelections.*.selectedRequiredModules' => 'array',
            'focusSelections.*.selectedRequiredModules.*' => 'string|exists:modules,id',
            'focusSelections.*.position' => 'required|integer|min:0'
        ];
    }
}
