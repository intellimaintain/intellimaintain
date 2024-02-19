export interface SendMessages<M> {
  sendMessage ( messages: M ): Promise<void>;
}
export interface MessageHandler<M> {
  onMessage ( message: M ): Promise<void>;
}

export interface SendMessages<M> {
  sendMessage ( messages: M ): Promise<void>;
}
export interface RegisterHandler<M> {
  registerHandler ( handler: MessageHandler<M> );
}
export interface IMessaging<M> extends SendMessages<M>, RegisterHandler<M> {
}
