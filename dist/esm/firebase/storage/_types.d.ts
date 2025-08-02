export type StorageMethodsInterface = {
    uploadFile: (file: File, fileName: string, folderSegments: string[]) => Promise<string>;
    deleteFile: (fileName: string, folderSegments: string[]) => Promise<void>;
    downloadFile: (fileName: string, folderSegments: string[]) => Promise<Blob>;
    getFileUrl: (fileName: string, folderSegments: string[]) => Promise<string>;
    listFiles: (folderSegments: string[]) => Promise<string[]>;
};
//# sourceMappingURL=_types.d.ts.map