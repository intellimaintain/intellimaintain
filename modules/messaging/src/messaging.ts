export interface SendMessages<M> {
  sendMessage ( messages: M ): Promise<void>;
}
export interface MessageHandler<M> {
  onMessage ( handler: ( message: M ) => Promise<void> ): Promise<void>;
}

export interface SendMessages<M> {
  sendMessage ( messages: M ): Promise<void>;
}
export interface RegisterHandler<M> {
  registerHandler ( handler: MessageHandler<M> ): Promise<void>;
}
export interface IMessaging<M> extends SendMessages<M>, RegisterHandler<M> {
}
