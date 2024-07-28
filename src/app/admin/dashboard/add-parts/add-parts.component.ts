import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, combineLatest, map } from 'rxjs';
import { Dealer } from 'src/app/interfaces/dealer';
import { Parts } from 'src/app/interfaces/parts';
import { DealerService } from 'src/app/services/dealer.service';
import { PartsService } from 'src/app/services/parts.service';

declare var bootstrap: any;

@Component({
  selector: 'app-add-parts',
  templateUrl: './add-parts.component.html',
  styleUrls: ['./add-parts.component.css']
})
export class AddPartsComponent implements OnInit{
  partForm: FormGroup;
  parts$: Observable<Parts[]>;
  dealers$: Observable<Dealer[]>;
  combinedData$: Observable<any[]>;
  selectedPart: Parts | null = null;
  isFormVisible: boolean = false;
  toastMessage: string = '';

  constructor(
    private fb: FormBuilder, 
    private partService: PartsService, 
    private dealerService: DealerService
  ) {
    this.partForm = this.fb.group({
      dealerId: ['', Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required],
      stockQuantity: ['', [Validators.required, Validators.min(0)]],
      
    });

    this.parts$ = this.partService.getParts();
    this.dealers$ = this.dealerService.getDealers();

    this.combinedData$ = combineLatest([this.parts$, this.dealers$]).pipe(
      map(([parts, dealers]) => {
        return parts.map(part => {
          const dealer = dealers.find(d => d.id === part.dealerId);
          return {
            ...part,
            dealerName: dealer ? dealer.name : 'Unknown Dealer'
          };
        });
      })
    );
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.partForm.valid) {
      const part: Parts = { ...this.partForm.value };

      if (this.selectedPart) {
        part.id = this.selectedPart.id;
        this.partService.updatePart(part).then(() => {
          this.selectedPart = null;
          this.partForm.reset();
          this.isFormVisible = false;
          this.showToast('Updated successfully!');
        });
      } else {
        this.partService.addPart(part).then(() => {
          this.partForm.reset();
          this.isFormVisible = false;
          this.showToast('Added successfully!');
        });
      }
    }
  }

  editPart(part: Parts): void {
    this.selectedPart = part;
    this.partForm.patchValue(part);
    this.isFormVisible = true;
  }

  deletePart(id: string): void {
    const confirmed = confirm('Are you sure you want to delete this part?');
    if (confirmed) {
    this.partService.deletePart(id).then(() => {
      this.showToast('Deleted successfully!');
    }).catch(error => {
      console.error('Error deleting part: ', error);
    });
  }
}

  showForm(): void {
    this.selectedPart = null;
    this.partForm.reset();
    this.isFormVisible = true;
  }

  cancel(): void {
    this.selectedPart = null;
    this.partForm.reset();
    this.isFormVisible = false;
  }

  
  showToast(message: string): void {
    this.toastMessage = message;
    const toastEl = document.getElementById('toastNotification');
    if (toastEl) {
      const toast = new bootstrap.Toast(toastEl);
      toast.show();
    }
  }

}
