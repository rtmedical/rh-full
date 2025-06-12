import { useState } from 'react';
import * as dicomService from '../../services/DicomImageService';
import LoadingComponent from '../LoadingComponent';

export default function DicomImageForm ({ dicomImage }: { dicomImage?: any }) {
    const [filename, setFilename] = useState(dicomImage?.filename || '');
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    if (loading) return <LoadingComponent/>;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (!file && !dicomImage) {
                throw new Error('Please select a file');
            }

            if (dicomImage) {
                if (file) {
                    // Atualização com arquivo: usa FormData
                    const formData = new FormData();
                    formData.append('filename', filename || file.name);
                    formData.append('file', file);
                    formData.append('_method', 'PUT');
                    await dicomService.updateDicomImage(dicomImage.id, formData, true);
                } else {
                    // Atualização só do nome: usa JSON
                    await dicomService.updateDicomImage(dicomImage.id, { filename }, false);
                }
            } else {
                // Para criação, arquivo é obrigatório
                if (!file) {
                    throw new Error('Please select a file');
                }
                const formData = new FormData();
                formData.append('filename', filename || file.name);
                formData.append('file', file);
                await dicomService.createDicomImage(formData);
            }
            window.location.href = '/';
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-sm p-8">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">
                            {dicomImage ? 'Atualizar Imagem DICOM' : 'Adicionar Nova Imagem DICOM'}
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            {dicomImage ? 'Atualize os detalhes da sua imagem DICOM' : 'Faça upload de uma nova imagem DICOM'}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="filename" className="block text-sm font-medium text-gray-700">
                                Nome do arquivo
                            </label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    id="filename"
                                    name="filename"
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    placeholder="Nome do arquivo"
                                    required={false}
                                    value={filename}
                                    onChange={(e) => setFilename(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="dropzone-file" className="block text-sm font-medium text-gray-700 mb-2">
                                Arquivo DICOM
                            </label>
                            <div className="flex items-center justify-center w-full">
                                <label
                                    htmlFor="dropzone-file"
                                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                                >
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <svg className="w-10 h-10 mb-4 text-gray-500" aria-hidden="true"
                                             xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                                  strokeWidth="2"
                                                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                                        </svg>
                                        <p className="mb-2 text-sm text-gray-500">
                                            <span className="font-semibold">Clique para fazer upload</span> ou arraste e solte o arquivo
                                        </p>
                                        <p className="text-xs text-gray-500">Apenas arquivos DICOM (.dcm)</p>
                                        {file && (
                                            <div className="mt-2">
                                                <p className="text-sm text-green-600 font-medium">
                                                    Arquivo selecionado: {file.name}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Tamanho: {(file.size / 1024 / 1024).toFixed(2)} MB
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Tipo: {file.type}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        id="dropzone-file"
                                        type="file"
                                        className="hidden"
                                        onChange={(e) => {
                                            const selectedFile = e.target.files?.[0];
                                            setFile(selectedFile || null);
                                        }}
                                        accept=".dcm"
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                            >
                                {dicomImage ? 'Atualizar' : 'Adicionar imagem DICOM'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}