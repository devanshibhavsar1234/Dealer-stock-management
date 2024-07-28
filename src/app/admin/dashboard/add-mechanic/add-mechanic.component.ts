import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Mechanic } from 'src/app/interfaces/mechanic';
import { MechanicService } from 'src/app/services/mechanic.service';
import { Dealer } from 'src/app/interfaces/dealer';
import { DealerService } from 'src/app/services/dealer.service';


declare var bootstrap: any;

@Component({
  selector: 'app-add-mechanic',
  templateUrl: './add-mechanic.component.html',
  styleUrls: ['./add-mechanic.component.css']
})
export class AddMechanicComponent implements OnInit {
  mechanicForm: FormGroup;
  mechanics$: Observable<Mechanic[]>;
  dealers$: Observable<Dealer[]>;
  combinedData$: Observable<any[]>; // Observable for combined data
  selectedMechanic: Mechanic | null = null;
  isFormVisible: boolean = false;
  toastMessage: string = '';

  constructor(
    private fb: FormBuilder, 
    private mechanicService: MechanicService, 
    private dealerService: DealerService
  ) {
    this.mechanicForm = this.fb.group({
      dealerId: ['', Validators.required],
      name: ['', Validators.required],
      mobileNo: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      birthDate: ['', Validators.required]
    });

    this.mechanics$ = this.mechanicService.getMechanics();
    this.dealers$ = this.dealerService.getDealers();

    // Combine mechanics and dealers data
    this.combinedData$ = combineLatest([this.mechanics$, this.dealers$]).pipe(
      map(([mechanics, dealers]) => {
        return mechanics.map(mechanic => {
          const dealer = dealers.find(d => d.id === mechanic.dealerId);
          return {
            ...mechanic,
            dealerName: dealer ? dealer.name : 'Unknown Dealer'
          };
        });
      })
    );
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.mechanicForm.valid) {
      const mechanic: Mechanic = { ...this.mechanicForm.value };

      if (this.selectedMechanic) {
        mechanic.id = this.selectedMechanic.id;
        this.mechanicService.updateMechanic(mechanic).then(() => {
          this.selectedMechanic = null;
          this.mechanicForm.reset();
          this.isFormVisible = false;
          this.showToast('Updated successfully!');
        });
      } else {
        this.mechanicService.addMechanic(mechanic).then(() => {
          this.mechanicForm.reset();
          this.isFormVisible = false;
          this.showToast('Added successfully!');
        });
      }
    }
  }

  editMechanic(mechanic: Mechanic): void {
    this.selectedMechanic = mechanic;
    this.mechanicForm.patchValue(mechanic);
    this.isFormVisible = true;
  }

  deleteMechanic(id: string): void {
   const confirmed = confirm('Are you sure you want to delete this mechanic?');
   if (confirmed) {
    this.mechanicService.deleteMechanic(id).then(() => {
      this.showToast('Deleted successfully!');
    }).catch(error => {
      console.error('Error deleting mechanic: ', error);
      this.showToast('Error deleting dealer!');
    });
  }
  }

  showForm(): void {
    this.selectedMechanic = null;
    this.mechanicForm.reset();
    this.isFormVisible = true;
  }

  cancel(): void {
    this.selectedMechanic = null;
    this.mechanicForm.reset();
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
