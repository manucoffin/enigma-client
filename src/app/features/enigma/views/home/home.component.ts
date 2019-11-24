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
    this.enigmaService
      .getAlgorithm()
      .subscribe(algorithm => (this.algorithm = algorithm));

    this.enigmaService
      .getValidationSlug()
      .subscribe(validationSlug => (this.validationSlug = validationSlug));

    this.decryptKeys$ = this.enigmaService.decryptKeys$;

    this.enigmaService.batch$.subscribe(batch => {
      console.log('batch received', batch);

      if (!this.batchTesting) {
        this.enigmaService.emitBatchAccepted(batch.decryptKeys);
        this.batchTesting = true;
        this.testBatch(batch.encryptedMessage, batch.decryptKeys);
      }
    });
  }

  private testBatch(encryptedMessage, decryptKeys): void {
    const batchValid = false;

    if (batchValid) {
      this.enigmaService.emitBatchValidated(decryptKeys[0], 'decryptedMessage');
    } else {
      this.enigmaService.emitBatchRejected(decryptKeys);
    }

    setTimeout(() => {
      this.batchTesting = false;
    }, 5000);
  }
}
