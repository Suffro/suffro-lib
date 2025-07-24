import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  getBlob,
  deleteObject,
  type FirebaseStorage,
} from "firebase/storage";
import { StorageMethodsInterface } from "./_types";
import { logger } from "../../_logger";

const getFilePath = (
  fileName: string,
  folderSegments: string[]
): { folderPath: string; fullPath: string; fileName: string } => {
  const cleanedFileName: string = fileName
    .trim()
    .replaceAll(" ", "_")
    .replaceAll("/", "");

  const cleanedSegments = folderSegments.filter((str) => str.trim() !== "");
  const segmentsString: string = cleanedSegments.join("/").trim();

  const folderPath: string = segmentsString
    .trim()
    .replaceAll("//", "/")
    .replaceAll(" ", "_");

  const rawFullPath: string = `${folderPath}/${cleanedFileName}`;
  const fullPath: string = rawFullPath
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

export const initStorageMethods = (
  storage: FirebaseStorage
): StorageMethodsInterface => ({
  /**
   * Carica un file su Firebase Storage in un path dinamico.
   * @param file - Il file da caricare
   * @param folderSegments - Array di stringhe che formano il path della cartella dove si trova il file (es. per branding/icons/logo.png dovrai passare ['branding', 'icons'])
   * @returns URL pubblico al file caricato
   */
  uploadFile: async function _uploadFile(
    file: File,
    fileName: string,
    folderSegments: string[]
  ): Promise<string> {
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

  /**
   * Elimina un file da Firebase Storage.
   * @param folderSegments - Array di stringhe che formano il path della cartella dove si trova il file (es. per branding/icons/logo.png dovrai passare ['branding', 'icons'])
   */
  deleteFile: async function _deleteFile(
    fileName: string,
    folderSegments: string[]
  ): Promise<void> {
    logger.logCaller();
    const filePath = getFilePath(fileName, folderSegments);
    const fileRef = ref(storage, filePath?.fullPath);

    await deleteObject(fileRef);
  },

  /**
   * Elenca tutti i file in una cartella.
   * @param folderSegments - Array di stringhe che formano il path della cartella dove si trova il file (es. per branding/icons/logo.png dovrai passare ['branding', 'icons'])
   */
  listFiles: async function _listFiles(
    folderSegments: string[]
  ): Promise<string[]> {
    logger.logCaller();
    const folderPath = getFilePath("", folderSegments)?.folderPath;
    const folderRef = ref(storage, folderPath);

    const res = await listAll(folderRef);
    const urls = await Promise.all(
      res.items.map((itemRef: any) => getDownloadURL(itemRef))
    );

    return urls;
  },

  /**
   * Scarica un file come Blob.
   * @param folderSegments - Array di stringhe che formano il path della cartella dove si trova il file (es. per branding/icons/logo.png dovrai passare ['branding', 'icons'])
   * @returns Un Blob del file
   */
  downloadFile: async function _downloadFileAsBlob(
    fileName: string,
    folderSegments: string[]
  ): Promise<Blob> {
    logger.logCaller();
    const filePath = getFilePath(fileName, folderSegments);
    const fileRef = ref(storage, filePath?.fullPath);

    return await getBlob(fileRef);
  },

  /**
   * Ottiene l'URL pubblico di un file.
   * @param folderSegments - Array di stringhe che formano il path della cartella dove si trova il file (es. per branding/icons/logo.png dovrai passare ['branding', 'icons'])
   */
  getFileUrl: async function _getPublicDownloadURL(
    fileName: string,
    folderSegments: string[]
  ): Promise<string> {
    logger.logCaller();
    const filePath = getFilePath(fileName, folderSegments);
    const fileRef = ref(storage, filePath?.fullPath);

    return await getDownloadURL(fileRef);
  },
});
