<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDicomImageRequest;
use App\Http\Requests\UpdateDicomImageRequest;
use App\Models\DicomImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DicomImageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $dicomImages = DicomImage::all();
        return response()->json($dicomImages);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDicomImageRequest $request)
    {
        $data = $request->validated();
        $request->input('filename');
        str_ends_with($request->input('filename'), '.dcm')
            ? $data['filename'] = $request->input('filename')
            : $data['filename'] = $request->input('filename') . '.dcm';
        $path = $request->file('file')->storeAs('exames', $data['filename']);
        $data['file_path'] = str_replace('exames/', '', $path);
        unset($data['file']);
        $dicomImage = DicomImage::create($data);
        $dicomImage->save();
        $responseJson = array(['id' => $dicomImage->id, 'file_path' => $dicomImage->file_path, 'created_at' => $dicomImage->created_at, 'updated_at' => $dicomImage->updated_at]);
        return response()->json($responseJson, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $data = DicomImage::find($id);
        return response()->json($data);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDicomImageRequest $request, string $id)
    {
        $file = $request->file('file');
        $filename = $request->input('filename');

        $dicomImage = DicomImage::findOrFail($id);
        $currentFilePath = 'exames/' . $dicomImage->file_path;

        if ($file) {
            $newFileName = $filename ?? basename($currentFilePath);
            $newFilePath = 'exames/' . $newFileName;
            if (!str_ends_with($newFileName, '.dcm')) {
                $newFileName .= '.dcm';
            }
            Storage::delete($currentFilePath);
            Storage::put($newFilePath, file_get_contents($file));
            $dicomImage->file_path = $newFileName;
        }

        if ($filename) {
            $newFileName = $filename;
            $newFilePath = 'exames/' . $newFileName;
            if (!str_ends_with($newFileName, '.dcm')) {
                $newFileName .= '.dcm';
            }
            Storage::move($currentFilePath, $newFilePath);
            $dicomImage->file_path = $newFileName;
        }

        $dicomImage->save();

        return response()->json(['message' => 'Arquivo atualizado com sucesso.', 'file_path' => $dicomImage->file_path]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $dicomImage = DicomImage::find($id);
        $dicomImage->delete();
        return response()->json('Exame deletado com sucesso', 204);
    }

    /**
     * Show the file, so the react can render it.
     */
    public function showFile(DicomImage $dicomImage)
    {
        $path = sprintf("exames/%s", $dicomImage->file_path);

        if (!Storage::exists($path)) {
            return response()->json(['error' => 'Arquivo não encontrado'], 404);
        }

        return response()->file(storage_path("app/{$path}"));
    }
}
