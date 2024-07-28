import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Dealer } from 'src/app/interfaces/dealer';
import { DealerService } from 'src/app/services/dealer.service';

declare var bootstrap: any;

@Component({
  selector: 'app-add-dealer',
  templateUrl: './add-dealer.component.html',
  styleUrls: ['./add-dealer.component.css']
})
export class AddDealerComponent implements OnInit {
  dealerForm: FormGroup;
  dealers: Observable<Dealer[]>;
  selectedDealer: Dealer | null = null;
  isFormVisible: boolean = false;
  toastMessage: string = '';

  constructor(private fb: FormBuilder, private dealerService: DealerService) {
    this.dealerForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      contactNo: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });

    this.dealers = this.dealerService.getDealers();
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.dealerForm.valid) {
      const dealer: Dealer = { ...this.dealerForm.value };

      if (this.selectedDealer) {
        dealer.id = this.selectedDealer.id;
        this.dealerService.updateDealer(dealer).then(() => {
          this.selectedDealer = null;
          this.dealerForm.reset();
          this.isFormVisible = false;
          this.showToast('Updated successfully!');
        });
      } else {
        this.dealerService.addDealer(dealer).then(() => {
          this.dealerForm.reset();
          this.isFormVisible = false;
          this.showToast('Added successfully!');
        });
      }
    }
  }

  editDealer(dealer: Dealer): void {
    this.selectedDealer = dealer;
    this.dealerForm.patchValue(dealer);
    this.isFormVisible = true;
  }

  deleteDealer(id: string): void {
    const confirmed = confirm('Are you sure you want to delete this dealer?');
    if (confirmed) {
      this.dealerService.deleteDealer(id).then(() => {
        this.showToast('Deleted successfully!');
      }).catch(error => {
        console.error('Error deleting dealer: ', error);
        this.showToast('Error deleting dealer!');
      });
    }
  }
  

  showForm(): void {
    this.selectedDealer = null;
    this.dealerForm.reset();
    this.isFormVisible = true;
  }

  cancel(): void {
    this.selectedDealer = null;
    this.dealerForm.reset();
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
