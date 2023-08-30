import { Component, OnInit,ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { customer } from '../domain/customer';
import { CrudService } from '../service/crud.service';
import { DatePipe } from '@angular/common';
import { ShareDataService } from '../service/share-data.service';
@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css'],
  providers: [MessageService, ConfirmationService,DatePipe]
})
export class CustomerComponent {
  constructor(private shareData: ShareDataService,private datePipe: DatePipe,private crudService: CrudService, private messageService: MessageService, private confirmationService: ConfirmationService){

  }
  customerDialog: boolean = false;

  customers!: customer[];

  customer!: customer;

  selectedCustomers!: customer[] | null;

  submitted: boolean = false;
  hostImage : string = 'https://localhost:7237/ImageKhachHang/'

  showbtCreate: boolean = false;
  showbtEdit: boolean = false;
  showbtDelete: boolean = false;
  showbtDeleteMultiple: boolean = false;
  ngOnInit() {
    this.crudService.getAll("Customer/khachhang_getall").subscribe(
      data=>{
        this.customers = data
        this.customers.forEach((value,index)=>{
          value.Hinhanh = this.hostImage + value.Hinhanh
        })
      }
    )

    const dataPermissions = sessionStorage.getItem('permissions')||""
    const listPermission = JSON.parse(dataPermissions);

    this.shareData.setSharedData({permissions:listPermission, tab: 'customer'})
    listPermission.forEach((permission:any) => {
        if(permission==="Admin"){
          this.showbtCreate = true;
          this.showbtDelete = true;
          this.showbtEdit = true;
          this.showbtDeleteMultiple = true;
          return true;
        }
        else if(permission === "Customer_Create"){
            this.showbtCreate = true;
        }else if(permission === "Customer_Update"){
          this.showbtEdit = true;
        }else if(permission === "Customer_Delete"){
          this.showbtDelete = true;
        }
         else if(permission === "Customer_DeleteMutiple"){
          this.showbtDeleteMultiple = true;
         }

         return false;
    });
  }

  
openNew() {
    this.customer = {};
    this.submitted = false;
    this.customerDialog = true;
}

deleteSelectedCustomers() {
    this.confirmationService.confirm({
        message: 'Are you sure you want to delete the selected customers?',
        header: 'Confirm',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.crudService.deleteMultipleItem("Customer/khachhang_deletemultiple",this.selectedCustomers).subscribe(
            data=>{
              if(data.messageCode == null){
                this.customers = this.customers.filter((val) => !this.selectedCustomers?.includes(val));
                this.selectedCustomers = null;
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Customers Deleted', life: 3000 });
              }
              else{
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error', life: 3000 });

              }
              
            }
          )
        }
    });
}


editCustomer(customer: customer) {
    this.customer = { ...customer };
    if (typeof this.customer.Ngaycap === 'string' && Date.parse(this.customer.Ngaycap)) {
      this.customer.Ngaycap = new Date(this.customer.Ngaycap);
    }
    this.customerDialog = true;
}

deleteCustomer(customer: customer) {
    this.confirmationService.confirm({
        message: 'Are you sure you want to delete ' + customer.Tenkhachhang + '?',
        header: 'Confirm',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.crudService.deleteItem("Customer/khachhang_delete",customer.Makhachhang).subscribe(
            data=>{
              if(data.messageCode == null){
                this.customers = this.customers.filter((val) => val.Makhachhang !== customer.Makhachhang);
                this.customer = {};
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'customer Deleted', life: 3000 });
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
    this.customerDialog = false;
    this.submitted = false;
}

onFileSelected(event: Event){
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if(file){
    const reader = new FileReader();
    reader.onload = () => {
      this.customer.Hinhanh = reader.result;
      this.customer.FileImage = file
    };
    reader.readAsDataURL(file);
  }
}

saveCustomer() {
    this.submitted = true;

    if ( this.customer.Tenkhachhang?.trim() && this.customer.Cccd?.trim() && this.customer.Sodienthoai?.trim()&&this.customer.Email?.trim()&& this.customer.Ngaycap) {
      var formData = new FormData()
      formData.append("Tenkhachhang",this.customer.Tenkhachhang ?? '')
      if (this.customer.Ngaycap) {
        let formattedNgaycap = this.datePipe.transform(this.customer.Ngaycap, 'yyyy-MM-dd');
        formData.append("Ngaycap", formattedNgaycap?? '');
      }
      formData.append("Cccd",this.customer.Cccd ?? '')
      formData.append("Diachi",this.customer.Diachi?? '')
      formData.append("Email",this.customer.Email?? '')
      formData.append("FileImage",this.customer.FileImage?? '')
      formData.append("Sodienthoai",this.customer.Sodienthoai?? '')
        if (this.customer.Makhachhang) {
            formData.append("Makhachhang",this.customer.Makhachhang.toString())
            if(typeof this.customer.Hinhanh == "string"){
              let ha = this.customer.Hinhanh.substring(this.customer.Hinhanh.lastIndexOf("/"))
              formData.append("Hinhanh",ha)
            }
            this.crudService.updateItem("Customer/khachhang_update",formData).subscribe(
              data=>{
                if(data.messageCode == null){
                  let index = this.customers.findIndex(item=>item.Makhachhang==this.customer.Makhachhang)
                  this.customers[index] = this.customer;
                  this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'customer updated', life: 3000 });
                }
                else{
                  this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error', life: 3000 });
                }
                
                this.customers = [...this.customers];
                this.customerDialog = false;
                this.customer = {};
              }
            )        } else {
            this.crudService.createItem("Customer/khachhang_createsingle",formData).subscribe(
              result=>{
                if(result){
                  result.Hinhanh = this.hostImage + result.Hinhanh
                  this.customers.unshift(result);
                  this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'customer created', life: 3000 });
                }
                else{
                  this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error', life: 3000 });
                }
                
                this.customers = [...this.customers];
                this.customerDialog = false;
                this.customer = {};
              }
            )
            
        }


    }
}


}
