<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSettingsRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return !$this->plan->read_only;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        return [
            'dayTimes' => 'array',
            'dayTimes.*' => 'required|exists:day_times,id',
            'locations' => 'array',
            'locations.*' => 'required|exists:locations,id',
        ];
    }
}
