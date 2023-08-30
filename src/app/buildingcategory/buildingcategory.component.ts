import { CrudService } from './../service/crud.service';
import { Component } from '@angular/core';
import { BuidingCategory } from '../domain/buildingctegory';
import { ConfirmationService, MessageService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { UrbanArea } from '../domain/urbanarea';
import { Address } from '../domain/address';
import { ShareDataService } from '../service/share-data.service';
@Component({
  selector: 'app-buildingcategory',
  templateUrl: './buildingcategory.component.html',
  styleUrls: ['./buildingcategory.component.css'],
  providers:[MessageService,ConfirmationService]
})
export class BuildingcategoryComponent {
  urbanareas!: UrbanArea[];
  address!: Address[];
  selectUrbanareas: any[]=[];
  selectAddress: Address | undefined;

  building!: BuidingCategory;
  buildings!: BuidingCategory[];
  buildingDialog: boolean = false;
  selectedBuildings!:BuidingCategory[]|null;
  submitted: boolean = false;

  showbtCreate: boolean = false;
  showbtEdit: boolean = false;
  showbtDelete: boolean = false;
  showbtDeleteMulti: boolean=false;

  constructor(private shareData: ShareDataService,private crudService:CrudService, private messageService: MessageService){}
  ngOnInit() {
    this.getBuildings();
    const dataPermissions = sessionStorage.getItem('permissions')||""
    const listPermission = JSON.parse(dataPermissions);
    this.shareData.setSharedData({permissions:listPermission, tab: 'buildingcategory'})
    if( listPermission.includes("Admin"))
    {
       this.showbtCreate=true;
       this.showbtDelete=true;
       this.showbtEdit = true;
       this.showbtDeleteMulti = true;
    }else{
    listPermission.forEach((building:any) => {
        if(building === "BuildingCategorie_Create"){
            this.showbtCreate = true;
        }else if(building === "BuildingCategorie_Update"){
          this.showbtEdit = true;
        }else if(building === "BuildingCategorie_Delete"){
          this.showbtDelete = true;
        }
        else if(building==="BuildingCategorie_DeleteMultiple"){
           this.showbtDeleteMulti = true;
        }
    })};
  }
  hideDialog() {
    this.buildingDialog = false;
    this.submitted = false;
  }
  getBuildings() {

    this.crudService.getAll('UrbanArea/GetAll').subscribe(
      (result) => {
          this.urbanareas = result;
      },
      (error) => {
          console.error('Error fetching customers:', error);
      }
    );
    this.crudService.getAll('Address/GetAll').subscribe(
      (result) => {
          this.address = result;
      },
      (error) => {
          console.error('Error fetching customers:', error);
      }
    );

    this.crudService.getAll('BuildingCategory/GetAll').subscribe(
          (result) => {
              this.buildings = result;
          },
          (error) => {
              console.error('Error fetching permissions:', error);
          }
      );
    }
    openNew() {
      this.building = {};
      this.submitted = false;
      this.buildingDialog = true;
    }
    editBuilding(building: BuidingCategory) {
      building.Address = this.address.find(item=>item.AddressId == building.AddressId)
    this.building = building;
    this.buildingDialog = true;
  }
  saveBuilding() {
  this.submitted = true;
  if(this.building.CategoryName?.trim() && this.building.Address && this.building.UrbanArea){
    this.building.AddressId = this.building.Address?.AddressId
    this.building.UrbanId = this.building.UrbanArea?.UrbanId
      if(this.building.CategoryId){

          this.crudService.updateItem('BuildingCategory/Update', this.building).subscribe(
              result =>{
                let index = this.buildings.findIndex(item=>item.CategoryId==this.building.CategoryId)
                this.buildings[index] = this.building;
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Customer Updated', life: 3000 });
                this.buildings = [...this.buildings];
                this.buildingDialog = false;
                this.building = {};
              },
              (error: HttpErrorResponse) => {
                if (error.status === 401) {

                    alert('Unauthorized access');
                } else {
                    // Handle other errors
                    console.error('An error occurred:', error.error);
                }
              }
          )
      }
      else{
        this.crudService.createItem('BuildingCategory/Create',this.building).subscribe(
          (result)=>{
            this.building.CategoryId = result;
            this.buildings.unshift(this.building);
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Customer Created', life: 3000 });
            this.buildings = [...this.buildings];
            this.buildingDialog = false;
            this.building = {};
          },
          (error: HttpErrorResponse) => {
            if (error.status === 401) {

                alert('Unauthorized access');
            } else {
                // Handle other errors
                console.error('An error occurred:', error.error);
            }
          }
        );
      }
    }
  }
  deleteBuilding(building: BuidingCategory){
    if(confirm(`Bạn có muốn xóa DM tòa nhà ${building.CategoryName} không?`)){
          this.crudService.deleteItem('BuildingCategory/Delete',building.CategoryId).subscribe(
            data => {
              if(data){
                const index = this.buildings.indexOf(building);
                if (index !== -1) {
                  this.buildings.splice(index, 1);
                }
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'apartment Deleted', life: 3000 });
              }
              else{
                this.messageService.add({ severity: 'error', summary: 'Fail', detail: 'Apartment can not delete', life: 3000 });

              }
            },
            (error) => {
                console.error('Error fetching apartment:', error);
            }
        );

    };
  }
  deleteSelectedBuilding() {
      if(confirm(`Bạn có muốn xóa danh sách DM tòa nhà không?`)){
      this.crudService.deleteMultipleItem("BuildingCategory/DeleteMultiple",this.selectedBuildings).subscribe(
        data=>{
          if(data== true){
            this.buildings = this.buildings.filter((val) => !this.selectedBuildings?.includes(val));
            this.selectedBuildings = null;
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Customers Deleted', life: 3000 });
          }
          else{
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error', life: 3000 });

          }

        }
      )
    }
  }
}
