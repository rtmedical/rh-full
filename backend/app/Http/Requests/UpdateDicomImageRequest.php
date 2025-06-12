<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDicomImageRequest extends FormRequest
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
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "file" => 'nullable|file|mimes:dcm|max:50000',
            "filename" => 'nullable|max:255',
        ];
    }

    public function messages()
    {
        return [
            "file.file" => "Arquivo inválido",
            "file.mimes" => "O arquivo deve ser do tipo DICOM (.dcm)",
            "file.max" => "O arquivo não pode ser maior que 50MB",
            "filename.max" => "O nome do arquivo não pode exceder 255 caracteres",
        ];
    }
}
