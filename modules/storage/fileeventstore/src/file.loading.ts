import { fileLocking, LockFileDetails, withFileLock } from "./with.lock";
import fs from "fs";
import { promisify } from "util";
import { ResultAndNewStart } from "@intellimaintain/eventstore";

const stat = promisify ( fs.stat );

async function getFileSize ( filePath: string ): Promise<number> {
  const stats = await stat ( filePath );
  return stats.size;
}
export interface FileLoading extends LockFileDetails {
  filePath: string;
}
export function fileLoading ( filePath: string ): FileLoading {
  return { ...fileLocking ( filePath ), filePath }
}

async function loadToEnd ( { filePath }: FileLoading, start: number ): Promise<string> {
  const newEventsStream = fs.createReadStream ( filePath, { start, encoding: 'utf-8' } );
  let newContent = '';
  try {
    for await ( const chunk of newEventsStream ) newContent += chunk;
  } catch ( err ) {
    newEventsStream.close (); // Close the stream to prevent further reading
    return Promise.reject ( err )
  }
  return newContent;
}


export const loadStringIncrementally = ( fileLoading: FileLoading ) => async ( start: number ): Promise<ResultAndNewStart> => {
  const fileSize = await getFileSize ( fileLoading.filePath );
  if ( fileSize === start ) return { newStart: start, result: '' };
  return withFileLock ( fileLoading, async () =>
    ({ newStart: await getFileSize ( fileLoading.filePath ), result: await loadToEnd ( fileLoading, start ) }) )
};
