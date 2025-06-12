import {useEffect, useMemo, useState} from "react";
import * as dicomService from "../../services/DicomImageService";
import {DicomImage} from "../../models/DicomImage";
import DicomViewer from "./DicomViewer";
import LoadingComponent from "../LoadingComponent";
import { Link, useParams, useNavigate } from "react-router-dom";

export default function ViewDicomImage() {
    const { id } = useParams();
    const numericId = id ? parseInt(id, 10) : 0;    
    const [dicomImage, setDicomImage] = useState<DicomImage | null>(null);
    const [file, setFile] = useState<Blob | null>(null);
    const [carregando, setCarregando] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const navigate = useNavigate();
    const imageUrl = useMemo(() => {
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            return 'wadouri:' + objectUrl;
        }
        return '';
    }, [file]);

    useEffect(() => {
        return () => {
            if (imageUrl) {
                URL.revokeObjectURL(imageUrl);
            }
        };
    }, [imageUrl]);

    useEffect(() => {
        if (!numericId) return;
        setCarregando(true);
        Promise.all([
            dicomService.getDicomImageById(numericId),
            dicomService.getDicomImageFileById(numericId)
        ])
            .then(([imageData, fileData]) => {
                setDicomImage(imageData);
                setFile(fileData);
            })
            .catch(error => console.error("Erro ao carregar DICOM:", error))
            .finally(() => setCarregando(false));
    }, [numericId]);

    const handleDelete = async () => {
        if (!dicomImage) return;
        setDeleting(true);
        try {
            await dicomService.deleteDicomImage(dicomImage.id.toString());
            setShowDeleteModal(false);
            navigate('/');
        } catch (error) {
            alert('Erro ao deletar a imagem.');
        } finally {
            setDeleting(false);
        }
    };

    if (carregando) {
        return <LoadingComponent/>;
    }
    return (
        <>
        <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 p-4 bg-white">
                <h1 className="text-2xl font-bold mb-4">Detalhes da Imagem DICOM</h1>
                <div className="mb-4">
                    <strong>ID:</strong> {dicomImage?.id}
                </div>
                <div className="mb-4">
                    <strong>Nome do Arquivo:</strong> {dicomImage?.filename}
                </div>
                <div className="mb-4">
                    <strong>Tamanho do Arquivo:</strong> {file?.size} bytes
                </div>
                <div className="mb-4">
                    <strong>Data de Criação:</strong> {new Date(dicomImage?.createdAt || '').toLocaleString()}
                </div>

                <div className="flex items-center px-4 space-x-4">
                    <Link to={`/dicom-image/update/${dicomImage?.id}`}>
                    <button type="button"
                            className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                        <svg aria-hidden="true" className="mr-1 -ml-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20"
                             xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path>
                            <path fillRule="evenodd"
                                  d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                                  clipRule="evenodd"></path>
                        </svg>
                        Edit
                    </button>
                    </Link>
                    <button type="button"
                            className="inline-flex items-center text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-900"
                            onClick={() => setShowDeleteModal(true)}>
                        <svg aria-hidden="true" className="w-5 h-5 mr-1.5 -ml-1" fill="currentColor" viewBox="0 0 20 20"
                             xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd"
                                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                  clipRule="evenodd"></path>
                        </svg>
                        Delete
                    </button>
                </div>

            </div>
            <div className="flex-1 p-4 bg-white rounded shadow justify-center">
                <DicomViewer imageUrl={imageUrl}/>
            </div>
        </div>
        {showDeleteModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full">
                    <h2 className="text-lg font-bold mb-4">Confirmar exclusão</h2>
                    <p className="mb-6">Tem certeza que deseja excluir esta imagem DICOM?</p>
                    <div className="flex justify-end gap-2">
                        <button
                            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700"
                            onClick={() => setShowDeleteModal(false)}
                            disabled={deleting}
                        >
                            Cancelar
                        </button>
                        <button
                            className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white font-bold"
                            onClick={handleDelete}
                            disabled={deleting}
                        >
                            {deleting ? 'Excluindo...' : 'Excluir'}
                        </button>
                    </div>
                </div>
            </div>
        )}
        </>
    );
}