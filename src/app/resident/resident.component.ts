import { apartment } from './../domain/apartment';
import { Component, OnInit,ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { resident } from '../domain/resident';
import { CrudService } from '../service/crud.service';
import { DatePipe } from '@angular/common';
import { ShareDataService } from '../service/share-data.service';
@Component({
  selector: 'app-resident',
  templateUrl: './resident.component.html',
  styleUrls: ['./resident.component.css'],
  providers: [MessageService, ConfirmationService,DatePipe]
})
export class ResidentComponent {
  constructor(private shareData: ShareDataService,private datePipe: DatePipe,private crudService: CrudService, private messageService: MessageService, private confirmationService: ConfirmationService){

  }
  residentDialog: boolean = false;
  residentDialog2 = false;
  residents!: resident[];
  apartments!: apartment[];
  resident!: resident;
  selectedApartments: any[] =[];
  selectedResidents!: resident[] | null;

  submitted: boolean = false;
  showbtCreate: boolean = false;
  showbtEdit: boolean = false;
  showbtDelete: boolean = false;
  showbtDeleteMultiple: boolean = false;
  
  ngOnInit() {
    this.crudService.getAll("Resident/GetAll").subscribe(
      data=>{
        this.residents = data
      }
    )
    this.crudService.getAll("Apartment/GetSelect").subscribe(
      data=>{
        this.apartments = data
      }
    )

    const dataPermissions = sessionStorage.getItem('permissions')||""
    const listPermission = JSON.parse(dataPermissions);

    this.shareData.setSharedData({permissions:listPermission, tab: 'resident'})
    listPermission.forEach((permission:any) => {
      if(permission==="Admin"){
        this.showbtCreate = true;
        this.showbtDelete = true;
        this.showbtEdit = true;
        this.showbtDeleteMultiple = true;
        return true;
      }
      else if(permission === "Resident_Create"){
          this.showbtCreate = true;
      }else if(permission === "Resident_Update"){
        this.showbtEdit = true;
      }else if(permission === "Resident_Delete"){
        this.showbtDelete = true;
      }
       else if(permission === "Resident_DeleteMutiple"){
        this.showbtDeleteMultiple = true;
       }

       return false;
  });
  }

  
openNew() {
    debugger
    this.resident = {};
    this.selectedApartments = []
    this.submitted = false;
    this.residentDialog = true;
}

deleteSelectedResidents() {
    this.confirmationService.confirm({
        message: 'Are you sure you want to delete the selected residents?',
        header: 'Confirm',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.crudService.deleteMultipleItem("Resident/DeleteMultiple",this.selectedResidents).subscribe(
            data=>{
              if(data){
                this.residents = this.residents.filter((val) => !this.selectedResidents?.includes(val));
                this.selectedResidents = null;
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Residents Deleted', life: 3000 });
              }
              else{
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error', life: 3000 });

              }
              
            }
          )
        }
    });
}


editResident(resident: resident) {
    this.crudService.getById("Resident/GetById",resident.ResidentId).subscribe(
      data=>{
        debugger
        this.selectedApartments = this.apartments.filter((val)=>data.ResidentApartments.some((item:any)=> item.ApartmentId == val.ApartmentId))
        this.resident= data
        if (typeof this.resident.DateOfBirth === 'string' && Date.parse(this.resident.DateOfBirth)) {
          this.resident.DateOfBirth = new Date(this.resident.DateOfBirth);
        }
        this.residentDialog = true;
      }
    )

}

deleteResident(resident: resident) {
    this.confirmationService.confirm({
        message: 'Are you sure you want to delete ' + resident.Name + '?',
        header: 'Confirm',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.crudService.deleteItem("Resident/Delete",resident.ResidentId).subscribe(
            data=>{
              if(data.messageCode == null){
                this.residents = this.residents.filter((val) => val.ResidentId !== resident.ResidentId);
                this.resident = {};
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'resident Deleted', life: 3000 });
              }
              else{
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error', life: 3000 });

              }
            }
          )

        }
    });
}

hideDialog() {
    this.residentDialog = false;
    this.submitted = false;
}


saveResident() {
    this.submitted = true;
    if ( this.resident.Name?.trim() && this.resident.Cccd?.trim() && this.resident.PhoneNumber?.trim()&&this.resident.Email?.trim()&& this.resident.Address?.trim()) {

        if (this.resident.ResidentId) {
          if(this.selectedApartments){
            this.resident.ResidentApartments = this.selectedApartments.map(apartment => {
              return {
                ResidentId: this.resident.ResidentId,
                ApartmentId: apartment.ApartmentId
              }})
          }
            this.crudService.updateItem("Resident/Update",this.resident).subscribe(
              data=>{
                if(data){
                  let index = this.residents.findIndex(item=>item.ResidentId==this.resident.ResidentId)
                  this.residents[index] = this.resident;
                  this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'resident updated', life: 3000 });
                }
                else{
                  this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error', life: 3000 });
                }
                
                this.residents = [...this.residents];
                this.residentDialog = false;
                this.resident = {};
              }
            )        
          } else {
            if(this.selectedApartments){
              this.resident.ResidentApartments = this.selectedApartments.map(apartment => {
                return {
                  ApartmentId: apartment.ApartmentId
                }})
            }
            this.crudService.createItem("Resident/Create",this.resident).subscribe(
              result=>{
                if(result){
                  this.resident.ResidentId = result
                  this.residents.unshift(this.resident);
                  this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'resident created', life: 3000 });
                }
                else{
                  this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error', life: 3000 });
                }
                
                this.residents = [...this.residents];
                this.residentDialog = false;
                this.resident = {};
              }
            )
            
        }


    }
}

residentDetail: resident = {};
    detailResident(resident:resident) {
      this.crudService.getById("Resident/GetDetail",resident.ResidentId).subscribe(
        (data:any)=>{
          this.residentDetail = data[0];
          // this.cdr.detectChanges();
          if (typeof this.residentDetail.DateOfBirth === 'string' && Date.parse(this.residentDetail.DateOfBirth)) {
            this.residentDetail.DateOfBirth = new Date(this.residentDetail.DateOfBirth);
          }
          this.residentDialog2 = true;
        }
      )

    }
}
