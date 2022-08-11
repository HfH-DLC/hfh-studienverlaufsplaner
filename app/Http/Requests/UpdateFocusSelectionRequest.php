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
            'firstFocusSelection' => 'required',
            'firstFocusSelection.focus' => 'required|string|exists:foci,id',
            'firstFocusSelection.selectedOptionalModules' => 'array',
            'firstFocusSelection.selectedOptionalModules.*' => 'string|exists:modules,id',
            'secondFocusSelection' => 'required',
            'secondFocusSelection.focus' => 'nullable|string|exists:foci,id',
            'secondFocusSelection.selectedOptionalModules' => 'array',
            'secondFocusSelection.selectedOptionalModules.*' => 'string|exists:modules,id',
        ];
    }
}
