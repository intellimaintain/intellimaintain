import { promises as fs, constants } from 'fs';
import { ErrorsAnd } from "@laoban/utils";

const wait = ( ms: number ) => new Promise ( resolve => setTimeout ( resolve, ms ) );

export interface LockFileDetails {
  lockFilePath: string
  timeout: number
}
// Attempts to acquire a lock
async function acquireLock ( { lockFilePath, timeout }: LockFileDetails ): Promise<boolean> {
  const startTime = Date.now ();
  while ( Date.now () - startTime < timeout ) {
    try {
      await fs.open ( lockFilePath, constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL );
      return true; // Lock acquired
    } catch ( error ) {
      if ( error.code === 'EEXIST' ) {
        await wait ( 100 ); // Wait before retrying if the lock exists
        continue;
      }
      throw error; // An unexpected error occurred
    }
  }
  return false; // Timeout reached without acquiring the lock
}

// Releases the lock
async function releaseLock ( lockFilePath: string ): Promise<void> {
  await fs.unlink ( lockFilePath );
}

// Higher-order function to manage file locking around the execution of a given function
export async function withFileLock<T> (
  details: LockFileDetails,
  action: () => Promise<T>,
): Promise<T> {
  if ( await acquireLock ( details ) ) {
    try {
      return await action ();
    } finally {
      await releaseLock ( details.lockFilePath );
    }
  } else {
    throw new Error ( `Failed to acquire lock ${JSON.stringify ( details )} within the specified timeout ` );
  }
}