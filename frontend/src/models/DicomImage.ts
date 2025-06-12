export interface DicomImage {
    id: number;
    filename: string;
    createdAt: Date;
    updatedAt: Date;
}

export function getDicomImageFromJson(json: any): DicomImage {
    return {
        id: json.id,
        filename: json.file_path,
        createdAt: new Date(json.created_at),
        updatedAt: new Date(json.updated_at),
    };
}