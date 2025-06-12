import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DicomImageForm from '../../components/dicomImage/DicomImageForm';
import * as dicomService from '../../services/DicomImageService';
import LoadingComponent from '../../components/LoadingComponent';

export default function DicomImageUpdate() {
    const { id } = useParams();
    const [dicomImage, setDicomImage] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            dicomService.getDicomImageById(Number.parseInt(id))
                .then(setDicomImage)
                .finally(() => setLoading(false));
        }
    }, [id]);

    if (loading) {
        return <LoadingComponent />;
    }

    return <DicomImageForm dicomImage={dicomImage} />;
}
