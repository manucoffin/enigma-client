import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { IDecryptKey } from '../types/decrypt-key.interface';
import { IBatch } from '../types/batch.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IMessageDecrypted } from '../types/message-decrypted.interface';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EnigmaService {
  public batch$: Observable<IBatch>;
  public decryptKeys$: Observable<IDecryptKey[]>;
  public messageDecrypted$: Observable<IMessageDecrypted>;

  constructor(private http: HttpClient, private socket: Socket) {
    this.batch$ = this.socket.fromEvent<IBatch>('batch');
    this.decryptKeys$ = this.socket.fromEvent<IDecryptKey[]>('decrypt-keys');
    this.messageDecrypted$ = this.socket.fromEvent<IMessageDecrypted>(
      'message/decrypted',
    );
  }

  public getValidationSlug(): Observable<string> {
    return this.http.get<string>(
      `${environment.enigmaServerUrl}/enigma/validation-slug`,
    );
  }

  public getAlgorithm(): Observable<string> {
    return this.http.get<string>(
      `${environment.enigmaServerUrl}/enigma/algorithm`,
    );
  }

  public emitBatchAccepted(decryptKeys: IDecryptKey[]): void {
    this.socket.emit('batch/accepted', decryptKeys);
  }

  public emitBatchRejected(decryptKeys: IDecryptKey[]): void {
    this.socket.emit('batch/rejected', decryptKeys);
  }

  public emitBatchValidated(
    decryptKey: IDecryptKey,
    decryptedMessage: string,
  ): void {
    this.socket.emit('batch/decrypted', { decryptKey, decryptedMessage });
  }

  public emitResetServer(): void {
    this.socket.emit('reset');
  }
}
