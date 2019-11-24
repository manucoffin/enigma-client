import { IDecryptKey } from './decrypt-key.interface';

export interface IBatch {
  decryptKeys: IDecryptKey[];
  encryptedMessage: string;
}
