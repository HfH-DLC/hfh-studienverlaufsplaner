<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateScheduleRequest extends FormRequest
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
        //todo validation of date parts
        return [
            'placements' => 'array',
            'placements.*.year' => 'required',
            'placements.*.semester' => 'required',
            'placements.*.timeWindow' => 'required',
            'placements.*.day' => 'required',
            'placements.*.time' => 'required',
            'placements.*.locationId' => 'required|exists:locations,id',
            'placements.*.moduleId' => 'required|exists:modules,id',
            'focusSelections' => 'array',
            'focusSelections.*.focusId' => 'required|string|exists:foci,id',
            'focusSelections.*.position' => 'required|integer|min:0',
            'tourCompleted' => 'required|boolean',
            'valid' => 'required|boolean',
        ];
    }
}
