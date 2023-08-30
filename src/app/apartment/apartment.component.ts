import { Component, OnInit,ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { apartment } from '../domain/apartment';
import { CrudService } from '../service/crud.service';
import { DatePipe } from '@angular/common';
import { ShareDataService } from '../service/share-data.service';
import { BuidingCategory } from '../domain/buildingctegory';
@Component({
  selector: 'app-apartment',
  templateUrl: './apartment.component.html',
  styleUrls: ['./apartment.component.css'],
  providers: [MessageService, ConfirmationService,DatePipe]
})
export class ApartmentComponent {
  constructor(private shareData: ShareDataService,private datePipe: DatePipe,private crudService: CrudService, private messageService: MessageService, private confirmationService: ConfirmationService){
    
  }
  apartmentDialog: boolean = false;

  apartments!: apartment[];

  apartment!: apartment;

  selectedApartments!: apartment[] | null;

  submitted: boolean = false;

  showbtCreate: boolean = false;
  showbtEdit: boolean = false;
  showbtDelete: boolean = false;
  showbtDeleteMultiple: boolean = false;
  selectedBuilding:BuidingCategory | undefined;
  buildings: BuidingCategory[]
  ngOnInit() {
    this.crudService.getAll("Apartment/GetSelect").subscribe(
      data=>{
        this.apartments = data
      }
    )
    this.crudService.getAll("BuildingCategory/GetAll").subscribe(
      data=>{
        this.buildings = data
      }
    )
    const dataPermissions = sessionStorage.getItem('permissions')||""
    const listPermission = JSON.parse(dataPermissions);

    this.shareData.setSharedData({permissions:listPermission, tab: 'apartment'})

    listPermission.forEach((permission:any) => {
      if(permission==="Admin"){
        this.showbtCreate = true;
        this.showbtDelete = true;
        this.showbtEdit = true;
        this.showbtDeleteMultiple = true;
        return true;
      }
      else if(permission === "Apartment_Create"){
            this.showbtCreate = true;
        }else if(permission === "Apartment_Update"){
          this.showbtEdit = true;
        }else if(permission === "Apartment_Delete"){
          this.showbtDelete = true;
        }
         else if(permission === "Apartment_DeleteMutiple"){
          this.showbtDeleteMultiple = true;
         }
      return false;
    });

  }

  
openNew() {
    this.apartment = {};
    this.submitted = false;
    this.apartmentDialog = true;
}

deleteSelectedApartments() {
    this.confirmationService.confirm({
        message: 'Are you sure you want to delete the selected apartments?',
        header: 'Confirm',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.crudService.deleteMultipleItem("Apartment/DeleteMultiple",this.selectedApartments).subscribe(
            data=>{
              if(data){
                this.apartments = this.apartments.filter((val) => !this.selectedApartments?.includes(val));
                this.selectedApartments = null;
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Apartments Deleted', life: 3000 });
              }
              else{
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error', life: 3000 });

              }
              
            }
          )
        }
    });
}


editApartment(apartment: apartment) {
  this.selectedBuilding = this.buildings.find(item=>item.CategoryId == apartment.CategoryId)
    this.apartment = { ...apartment };
    this.apartmentDialog = true;
}

deleteApartment(apartment: apartment) {
    this.confirmationService.confirm({
        message: 'Are you sure you want to delete ' + apartment.ApartmentName + '?',
        header: 'Confirm',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.crudService.deleteItem("Apartment/Delete",apartment.ApartmentId).subscribe(
            data=>{
              if(data){
                this.apartments = this.apartments.filter((val) => val.ApartmentId !== apartment.ApartmentId);
                this.apartment = {};
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'apartment Deleted', life: 3000 });
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
    this.apartmentDialog = false;
    this.submitted = false;
}

saveApartment() {
    this.submitted = true;

    if ( this.apartment.ApartmentName?.trim() && this.apartment.Building?.trim() && this.apartment.Space&&this.apartment.Floor) {
      this.apartment.CategoryId = this.selectedBuilding?.CategoryId
      if (this.apartment.ApartmentId) {
            this.crudService.updateItem("Apartment/Update",this.apartment).subscribe(
              data=>{
                if(data){
                  this.apartment.BuildingCategory = this.selectedBuilding;
                  let index = this.apartments.findIndex(item=>item.ApartmentId==this.apartment.ApartmentId)
                  this.apartments[index] = this.apartment;
                  this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'apartment updated', life: 3000 });
                }
                else{
                  this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error', life: 3000 });
                }
                
                this.apartments = [...this.apartments];
                this.apartmentDialog = false;
                this.apartment = {};
                this.selectedBuilding = {}
              }
            )       
       } 
      else {
            
            this.crudService.createItem("Apartment/Create",this.apartment).subscribe(
              result=>{
                if(result){
                  this.apartment.BuildingCategory = this.selectedBuilding;
                  this.apartment.ApartmentId =result
                  this.apartments.unshift(this.apartment);
                  this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'apartment created', life: 3000 });
                }
                else{
                  this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error', life: 3000 });
                }
                
                this.apartments = [...this.apartments];
                this.apartmentDialog = false;
                this.apartment = {};
                this.selectedBuilding = {}
              }
            )
            
        }
        

    }
}
}
