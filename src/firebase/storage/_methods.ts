import { ref, uploadBytes, getDownloadURL, listAll, getBlob, deleteObject, type FirebaseStorage } from 'firebase/storage';
import { _storage } from '../_init';

const getFilePath = (fileName:string, folderSegments: string[]): {folderPath: string; fullPath: string; fileName: string;} => {

  const cleanedFileName: string = fileName.trim().replaceAll(" ","_").replaceAll("/","");

  const cleanedSegments = folderSegments.filter(str => str.trim() !== "");
  const segmentsString: string = cleanedSegments.join('/').trim();

  const folderPath: string = segmentsString.trim().replaceAll("//","/").replaceAll(" ","_");

  const rawFullPath: string = `${folderPath}/${cleanedFileName}`;
  const fullPath: string = rawFullPath.trim().replaceAll("//","/").replaceAll(" ","_");

  if(!(typeof fullPath === 'string' && fullPath.trim().length > 0)) throw "The file path is empty or invalid";

  return {
    folderPath,
    fullPath,
    fileName: cleanedFileName,
  };
}

/**
 * Carica un file su Firebase Storage in un path dinamico.
 * @param file - Il file da caricare
 * @param folderSegments - Array di stringhe che formano il path della cartella dove si trova il file (es. per branding/icons/logo.png dovrai passare ['branding', 'icons'])
 * @returns URL pubblico al file caricato
 */
async function _uploadFile(file: File, fileName:string, folderSegments: string[]): Promise<string> {
  if (folderSegments.length === 0) {
    throw new Error('Storage path is required');
  }

  const filePath = getFilePath(fileName,folderSegments);
  const fileRef = ref(_storage, filePath?.fullPath);

  const snapshot = await uploadBytes(fileRef, file);
  const url = await getDownloadURL(snapshot.ref);

  return url;
}

/**
 * Elimina un file da Firebase Storage.
 * @param folderSegments - Array di stringhe che formano il path della cartella dove si trova il file (es. per branding/icons/logo.png dovrai passare ['branding', 'icons'])
 */
async function _deleteFile(fileName:string, folderSegments: string[]): Promise<void> {
  const filePath = getFilePath(fileName,folderSegments);
  const fileRef = ref(_storage, filePath?.fullPath);

  await deleteObject(fileRef);
}

/**
 * Elenca tutti i file in una cartella.
 * @param folderSegments - Array di stringhe che formano il path della cartella dove si trova il file (es. per branding/icons/logo.png dovrai passare ['branding', 'icons'])
 */
async function _listFiles(folderSegments: string[]): Promise<string[]> {
  const folderPath = getFilePath("",folderSegments)?.folderPath;
  const folderRef = ref(_storage, folderPath);

  const res = await listAll(folderRef);
  const urls = await Promise.all(res.items.map((itemRef: any) => getDownloadURL(itemRef)));

  return urls;
}

/**
 * Scarica un file come Blob.
 * @param folderSegments - Array di stringhe che formano il path della cartella dove si trova il file (es. per branding/icons/logo.png dovrai passare ['branding', 'icons'])
 * @returns Un Blob del file
 */
async function _downloadFileAsBlob(fileName:string, folderSegments: string[]): Promise<Blob> {
  const filePath = getFilePath(fileName,folderSegments);
  const fileRef = ref(_storage, filePath?.fullPath);

  return await getBlob(fileRef);
}

/**
 * Ottiene l'URL pubblico di un file.
 * @param folderSegments - Array di stringhe che formano il path della cartella dove si trova il file (es. per branding/icons/logo.png dovrai passare ['branding', 'icons'])
 */
async function _getPublicDownloadURL(fileName:string, folderSegments: string[]): Promise<string> {
  const filePath = getFilePath(fileName,folderSegments);
  const fileRef = ref(_storage, filePath?.fullPath);

  return await getDownloadURL(fileRef);
}

export const _storageMethods: {
  uploadFile: (file: File, fileName: string, folderSegments: string[]) => Promise<string>;
  deleteFile: (fileName: string, folderSegments: string[]) => Promise<void>;
  downloadFile: (fileName: string, folderSegments: string[]) => Promise<Blob>;
  getFileUrl: (fileName: string, folderSegments: string[]) => Promise<string>;
  listFiles: (folderSegments: string[]) => Promise<string[]>;
  instance: FirebaseStorage;
} = {
  instance: _storage,
  uploadFile: _uploadFile,
  deleteFile: _deleteFile,
  downloadFile: _downloadFileAsBlob,
  getFileUrl: _getPublicDownloadURL,
  listFiles: _listFiles,
}