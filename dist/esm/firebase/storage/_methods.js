import { ref, uploadBytes, getDownloadURL, listAll, getBlob, deleteObject, } from "firebase/storage";
import { logger } from "../../_logger";
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
export const initStorageMethods = (storage) => ({
    uploadFile: async function _uploadFile(file, fileName, folderSegments) {
        logger.logCaller();
        if (folderSegments.length === 0) {
            throw new Error("Storage path is required");
        }
        const filePath = getFilePath(fileName, folderSegments);
        const fileRef = ref(storage, filePath?.fullPath);
        const snapshot = await uploadBytes(fileRef, file);
        const url = await getDownloadURL(snapshot.ref);
        return url;
    },
    deleteFile: async function _deleteFile(fileName, folderSegments) {
        logger.logCaller();
        const filePath = getFilePath(fileName, folderSegments);
        const fileRef = ref(storage, filePath?.fullPath);
        await deleteObject(fileRef);
    },
    listFiles: async function _listFiles(folderSegments) {
        logger.logCaller();
        const folderPath = getFilePath("", folderSegments)?.folderPath;
        const folderRef = ref(storage, folderPath);
        const res = await listAll(folderRef);
        const urls = await Promise.all(res.items.map((itemRef) => getDownloadURL(itemRef)));
        return urls;
    },
    downloadFile: async function _downloadFileAsBlob(fileName, folderSegments) {
        logger.logCaller();
        const filePath = getFilePath(fileName, folderSegments);
        const fileRef = ref(storage, filePath?.fullPath);
        return await getBlob(fileRef);
    },
    getFileUrl: async function _getPublicDownloadURL(fileName, folderSegments) {
        logger.logCaller();
        const filePath = getFilePath(fileName, folderSegments);
        const fileRef = ref(storage, filePath?.fullPath);
        return await getDownloadURL(fileRef);
    },
});
