import { IDecryptKey } from './decrypt-key.interface';

export interface IMessageDecrypted {
  decryptedMessage: string;
  key: IDecryptKey;
}
