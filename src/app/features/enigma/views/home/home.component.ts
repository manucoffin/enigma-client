import { Component, OnInit } from '@angular/core';
import { EnigmaService } from '../../services/enigma.service';
import { IDecryptKey } from '../../types/decrypt-key.interface';
import { Observable } from 'rxjs';
import { IMessageDecrypted } from '../../types/message-decrypted.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public decryptKeys$: Observable<IDecryptKey[]>;
  public algorithm: string;
  public validationSlug: string;
  public statuses = ['unknown', 'pending', 'rejected', 'validated'];

  private batchTesting = false;

  constructor(private enigmaService: EnigmaService) {}

  ngOnInit() {
    // this.decryptMessage('Je vais au texas avec Georges Abitbol.', 5);
    // this.decryptMessage('Oj afnx fz yjcfx fajh Ljtwljx Fgnygtq.', -5);

    this.enigmaService
      .getAlgorithm()
      .subscribe(algorithm => (this.algorithm = algorithm));

    this.enigmaService
      .getValidationSlug()
      .subscribe(validationSlug => (this.validationSlug = validationSlug));

    this.decryptKeys$ = this.enigmaService.decryptKeys$;

    this.enigmaService.batch$.subscribe(batch => {
      console.log('batch received');
      if (!this.batchTesting && this.algorithm && this.validationSlug) {
        console.log('batch accepted', batch);
        this.enigmaService.emitBatchAccepted(batch.decryptKeys);
        this.batchTesting = true;
        this.testBatch(batch.encryptedMessage, batch.decryptKeys);
      }
    });

    this.enigmaService.messageDecrypted$.subscribe(
      (decryptedData: IMessageDecrypted) => {
        alert(`Le message a été décrypté: ${decryptedData.decryptedMessage}`);
      },
    );
  }

  private testBatch(encryptedMessage, decryptKeys): void {
    let batchValid = false;
    let validKey: IDecryptKey;
    let validMessage: string;

    decryptKeys.map((key: IDecryptKey) => {
      const algorithm = this.algorithm
        .replace('amountVar', key.key)
        .replace('strVar', encryptedMessage);

      const decryptedMessage = eval(algorithm);

      console.log(
        decryptedMessage,
        decryptedMessage.includes(this.validationSlug),
      );

      // If the batch is valid
      if (decryptedMessage.includes(this.validationSlug)) {
        validKey = key;
        validMessage = decryptedMessage;
        batchValid = true;
      }

      return;
    });

    if (batchValid) {
      console.log('emit', validKey);
      this.enigmaService.emitBatchValidated(validKey, validMessage);
    } else {
      this.enigmaService.emitBatchRejected(decryptKeys);
    }

    this.batchTesting = false;
  }
}
