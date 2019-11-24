import { Component, OnInit } from '@angular/core';
import { EnigmaService } from '../../services/enigma.service';
import { IDecryptKey } from '../../types/decrypt-key.interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public decryptKeys$: Observable<IDecryptKey[]>;
  public algorithm: string;
  public validationSlug: string;

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
      if (!this.batchTesting && this.algorithm && this.validationSlug) {
        this.enigmaService.emitBatchAccepted(batch.decryptKeys);
        this.batchTesting = true;
        this.testBatch(batch.encryptedMessage, batch.decryptKeys);
      }
    });
  }

  private testBatch(encryptedMessage, decryptKeys): void {
    let batchValid = false;

    decryptKeys.map((key: IDecryptKey) => {
      const algorithm = this.algorithm
        .replace('amountVar', key.key)
        .replace('strVar', encryptedMessage);

      const decryptedMessage = eval(algorithm);

      console.log(decryptedMessage, key.key);

      batchValid = decryptedMessage.includes(this.validationSlug);
    });

    if (batchValid) {
      this.enigmaService.emitBatchValidated(decryptKeys[0], 'decryptedMessage');
    } else {
      this.enigmaService.emitBatchRejected(decryptKeys);
    }
  }
}
