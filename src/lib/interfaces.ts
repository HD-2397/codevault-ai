export interface FileMetaData {
    id: string;
    fileName: string;
    uploadedAt: Date;
    fileSizeKB?: number;
    totalChunks?: number;
}