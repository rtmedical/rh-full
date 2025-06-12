import {DicomImage, getDicomImageFromJson} from "../models/DicomImage";
import {httpClient} from '../api/httpClient';

export const getAllDicomImages = async (): Promise<DicomImage[]> => {
    const response = await httpClient.get('/dicom-images');
    return response.data.map(getDicomImageFromJson);
};

export const getDicomImageById = async (id: number): Promise<DicomImage> => {
    const response = await httpClient.get(`/dicom-images/${id}`);
    return getDicomImageFromJson(response.data);
};

export const getDicomImageFileById = async (id: number): Promise<Blob> => {
    const response = await httpClient.get(`/dicom-images/${id}/file`, {
        responseType: 'arraybuffer',
    });
    const dicomArrayBuffer = response.data;
    return new Blob([dicomArrayBuffer], {type: 'application/dicom'});
}

export const createDicomImage = async (formData: FormData): Promise<DicomImage> => {
    const response = await httpClient.post('/dicom-images', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return getDicomImageFromJson(response.data);
};

export const updateDicomImage = async (id: string, data: any, isFormData = false): Promise<DicomImage> => {
    if (isFormData) {
        return (await httpClient.post(`/dicom-images/${id}`, data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })).data;
    } else {
        return (await httpClient.put(`/dicom-images/${id}`, data)).data;
    }
};

export const deleteDicomImage = async (id: string): Promise<void> => {
    await httpClient.delete(`/dicom-images/${id}`);
};