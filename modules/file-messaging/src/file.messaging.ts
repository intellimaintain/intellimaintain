import { FileOps } from "@laoban/fileops";
import { promises as fsPromises } from 'fs';
import * as path from 'path';
import { LockFileDetails, withFileLock } from "./with.lock";
import { ErrorsAnd } from "@laoban/utils";
import { IMessaging, MessageHandler } from "@intellimaintain/messaging";
import { Parser } from "@intellimaintain/utils";

const { writeFile, readFile, appendFile } = fsPromises;

export interface FileMessagingDetails<M> extends LockFileDetails {
  file: string
  listeners: MessageHandler<M>[]
  parser: Parser<M>
}

export function fileMessaging<M> ( details: FileMessagingDetails<M> ): IMessaging<M> {
  return {
    sendMessage: s => withFileLock ( details, () => appendFile ( details.file, JSON.stringify ( s ) + '\n' ) ),
    registerHandler: ( handler: MessageHandler<M> ) => details.listeners.push ( handler )
  }
}

export function notifyListeners<M> ( details: FileMessagingDetails<M>, message: M ): void {
  details.listeners.forEach ( listener => listener.onMessage ( message ) );
}

export function startListening<M> ( details: FileMessagingDetails<M> ): void {
  let lastSize = 0;
  setInterval ( async () => {
    withFileLock ( details, async () => {
      const stats = await fsPromises.stat ( details.file );
      if ( stats.size > lastSize ) {
        const data = await readFile ( details.file, { encoding: 'utf-8' } );
        const newMessages = data.split ( '\n' ).slice ( lastSize ? lastSize : 0 ); // Get new messages only
        newMessages.forEach ( async ( message ) => {
          if ( message ) {
            const m = details.parser.parse ( `listening to file ${JSON.stringify ( details )}` ) ( message );
            notifyListeners ( details, m ); // TODO should handle errors by notifying a different listener
          }
        } );
        lastSize = data.split ( '\n' ).length;
      }
    } )
  } )
}


