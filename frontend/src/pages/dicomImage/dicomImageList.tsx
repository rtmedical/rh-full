import {useEffect, useState} from 'react';
import {DicomImage} from '../../models/DicomImage.js';
import * as dicomService from '../../services/DicomImageService';
import TableDicomImage from "../../components/dicomImage/TableDicomImage";
import ViewDicomImage from "../../components/dicomImage/ViewDicomImage";
import { Link } from 'react-router-dom';

export default function DicomImageList() {
    const [images, setImages] = useState<DicomImage[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        dicomService.getAllDicomImages()
            .then(setImages)
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Lista de Imagens DICOM</h1>
                            <p className="mt-1 text-sm text-gray-500">
                                Gerencie suas imagens DICOM de forma eficiente
                            </p>
                        </div>
                        <Link to="/dicom-image/new">
                            <button
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200">
                                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Adicionar Imagem DICOM
                            </button>
                        </Link>
                    </div>
                    <div className="mt-6">
                        <TableDicomImage loading={loading} images={images}/>
                    </div>
                </div>
            </div>
        </div>
    );
}
