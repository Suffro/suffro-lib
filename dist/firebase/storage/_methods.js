"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initStorageMethods = void 0;
const storage_1 = require("firebase/storage");
const _logger_1 = require("../../_logger");
const getFilePath = (fileName, folderSegments) => {
    const cleanedFileName = fileName
        .trim()
        .replaceAll(" ", "_")
        .replaceAll("/", "");
    const cleanedSegments = folderSegments.filter((str) => str.trim() !== "");
    const segmentsString = cleanedSegments.join("/").trim();
    const folderPath = segmentsString
        .trim()
        .replaceAll("//", "/")
        .replaceAll(" ", "_");
    const rawFullPath = `${folderPath}/${cleanedFileName}`;
    const fullPath = rawFullPath
        .trim()
        .replaceAll("//", "/")
        .replaceAll(" ", "_");
    if (!(typeof fullPath === "string" && fullPath.trim().length > 0))
        throw "The file path is empty or invalid";
    return {
        folderPath,
        fullPath,
        fileName: cleanedFileName,
    };
};
const initStorageMethods = (storage) => ({
    uploadFile: async function _uploadFile(file, fileName, folderSegments) {
        _logger_1.logger.logCaller();
        if (folderSegments.length === 0) {
            throw new Error("Storage path is required");
        }
        const filePath = getFilePath(fileName, folderSegments);
        const fileRef = (0, storage_1.ref)(storage, filePath?.fullPath);
        const snapshot = await (0, storage_1.uploadBytes)(fileRef, file);
        const url = await (0, storage_1.getDownloadURL)(snapshot.ref);
        return url;
    },
    deleteFile: async function _deleteFile(fileName, folderSegments) {
        _logger_1.logger.logCaller();
        const filePath = getFilePath(fileName, folderSegments);
        const fileRef = (0, storage_1.ref)(storage, filePath?.fullPath);
        await (0, storage_1.deleteObject)(fileRef);
    },
    listFiles: async function _listFiles(folderSegments) {
        _logger_1.logger.logCaller();
        const folderPath = getFilePath("", folderSegments)?.folderPath;
        const folderRef = (0, storage_1.ref)(storage, folderPath);
        const res = await (0, storage_1.listAll)(folderRef);
        const urls = await Promise.all(res.items.map((itemRef) => (0, storage_1.getDownloadURL)(itemRef)));
        return urls;
    },
    downloadFile: async function _downloadFileAsBlob(fileName, folderSegments) {
        _logger_1.logger.logCaller();
        const filePath = getFilePath(fileName, folderSegments);
        const fileRef = (0, storage_1.ref)(storage, filePath?.fullPath);
        return await (0, storage_1.getBlob)(fileRef);
    },
    getFileUrl: async function _getPublicDownloadURL(fileName, folderSegments) {
        _logger_1.logger.logCaller();
        const filePath = getFilePath(fileName, folderSegments);
        const fileRef = (0, storage_1.ref)(storage, filePath?.fullPath);
        return await (0, storage_1.getDownloadURL)(fileRef);
    },
});
exports.initStorageMethods = initStorageMethods;
