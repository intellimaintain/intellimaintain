export interface HasSendMessage {
  sendMessage: ( message: string ) => void
}
export interface HasSendMail {
  sendMail: ( message: string ) => void
}
export interface DI extends HasSendMessage, HasSendMail {
}