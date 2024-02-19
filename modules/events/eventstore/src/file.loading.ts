import { LockFileDetails, withFileLock } from "./with.lock";
import fs from "fs";
import { promisify } from "util";

const stat = promisify ( fs.stat );

async function getFileSize ( filePath: string ): Promise<number> {
  const stats = await stat ( filePath );
  return stats.size;
}
export interface FileLoading extends LockFileDetails {
  filePath: string;
  lastFileSize: number;
}
export function fileLoading ( filePath: string, lastFileSize = 0 ): FileLoading {
  return { filePath, lockFilePath: filePath + '.lock', lastFileSize, timeout: 5000 }
}

async function loadToEnd ( { filePath, lastFileSize }: FileLoading ): Promise<string> {
  const newEventsStream = fs.createReadStream ( filePath, { start: lastFileSize, encoding: 'utf-8' } );
  let newContent = '';
  try {
    for await ( const chunk of newEventsStream ) newContent += chunk;
  } catch ( err ) {
    newEventsStream.close (); // Close the stream to prevent further reading
    return Promise.reject ( err )
  }
  return newContent;
}

export interface FileLoadingAnd<T> {
  fileLoading: FileLoading
  result: T
}
export async function loadStringIncrementally<X extends FileLoading> ( fileLoading: FileLoading ): Promise<FileLoadingAnd<string>> {
  const fileSize = await getFileSize ( fileLoading.filePath );
  if ( fileSize === fileLoading.lastFileSize ) return { fileLoading, result: '' };
  return withFileLock ( fileLoading, async () => {
    const fileSize = await getFileSize ( fileLoading.filePath );
    const result = await loadToEnd ( fileLoading )
    const newFileLoading = { ...fileLoading, lastFileSize: fileSize };
    return { fileLoading: newFileLoading, result }
  } )
}
