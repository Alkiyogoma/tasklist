<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UtilityStoreRequest extends FormRequest
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
     */
    public function rules(): array
    {
        return [
            'property_id' => 'required|exists:properties,id',
            'user_id' => 'required|exists:users,id',
            'type' => 'required|in:electricity,water,gas',
            'amount' => 'required|numeric|min:0',
            'bill_date' => 'required|date',
        ];
    }
}
