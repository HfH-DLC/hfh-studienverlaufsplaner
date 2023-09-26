<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePriorLearningsRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        return [
            'priorLearnings' => 'array',
            'priorLearnings.*.id' => 'exists:prior_learnings,id',
            'priorLearnings.*.name' => ['string', 'nullable'],
            'priorLearnings.*.ects' => ['required_without:priorLearnings.*.countsAsModuleId', 'prohibits:priorLearnings.*.countsAsModuleId', 'integer', 'min:1'],
            'priorLearnings.*.countsAsCategoryId' => ['required_without:priorLearnings.*.countsAsModuleId', 'prohibits:priorLearnings.*.countsAsModuleId', 'exists:categories,id', 'prohibits:priorLearnings.*.countsAsModuleId'],
            'priorLearnings.*.countsAsModuleId' => [
                'exists:modules,id',
                'required_without:priorLearnings.*.ects', 'prohibits:priorLearnings.*.ects', 'prohibits:priorLearnings.*.countsAsCategoryId'
            ],
            'isScheduleValid' => ['required', 'bool']
        ];
    }
}
