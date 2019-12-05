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
  public decryptedMessages: string[] = [];
  public consoleMessages: { text: string; class: string }[] = [];

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
      this.consoleMessages.push({ text: 'Batch received.', class: 'primary' });

      if (!this.batchTesting && this.algorithm && this.validationSlug) {
        this.consoleMessages.push({
          text: 'Batch accepted.',
          class: 'success',
        });

        this.enigmaService.emitBatchAccepted(batch.decryptKeys);
        this.batchTesting = true;

        // We set a timeout to simulate long calculations
        setTimeout(() => {
          this.testBatch(batch.encryptedMessage, batch.decryptKeys);
        }, 5000);
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

      this.decryptedMessages[key.id] = decryptedMessage;

      // If the batch is valid
      if (decryptedMessage.includes(this.validationSlug)) {
        validKey = key;
        validMessage = decryptedMessage;
        batchValid = true;
      }

      return;
    });

    if (batchValid) {
      this.consoleMessages.push({
        text: `Message decrypted: ${validMessage}`,
        class: 'success',
      });
      this.enigmaService.emitBatchValidated(validKey, validMessage);
    } else {
      this.consoleMessages.push({
        text: `Batch invalid.`,
        class: 'error',
      });
      this.enigmaService.emitBatchRejected(decryptKeys);
    }

    this.batchTesting = false;
  }
}
