import { Component, OnInit } from '@angular/core';
import { MessageService,ConfirmationService } from 'primeng/api';
import { User } from '../domain/User';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { Permission } from '../domain/permission';
import { elementAt } from 'rxjs';
import { CrudService } from '../service/crud.service';
import { ShareDataService } from '../service/share-data.service';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  providers:[MessageService, ConfirmationService]
})
export class UserComponent implements OnInit{

      permissions!:Permission[];
      selecttedPermissions: any[]=[];
      user!: User;
      users!:User[];
      selectedUsers!: User[]|null;
      submitted: boolean = false;
      userDialog: boolean=false;
      showNewPasswordInput: boolean = true;
      showPasswordInput: boolean = true;

      showbtCreate: boolean = false;
      showbtEdit: boolean = false;
      showbtDelete: boolean = false;
      showbtDeleteMultiple: boolean = false;
    constructor(private shareData: ShareDataService,private crudService:CrudService, private messageService: MessageService, private confirmationService: ConfirmationService  ){}
    ngOnInit() {
        this.getUsers();

        const dataPermissions = sessionStorage.getItem('permissions')||""
        const listPermission = JSON.parse(dataPermissions);

        this.shareData.setSharedData({permissions:listPermission, tab: 'user'})
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
    hideDialog() {
      this.userDialog = false;
      this.submitted = false;
    }
    getUsers() {
      this.crudService.getAll('Permission/GetAll').subscribe(
          (result) => {
              this.permissions = result.Result;
          },
          (error) => {
              console.error('Error fetching permissions:', error);
          }
      );
      this.crudService.getAll('User/GetAll').subscribe(
        (result) => {
            this.users = result;
        },
        (error) => {
            console.error('Error fetching customers:', error);
        }
    );
  }
  openNew() {
    this.user = {};
    this.submitted = false;
    this.userDialog = true;
    this.showPasswordInput = true;
    this.showNewPasswordInput = false;
  }
  editUser(user: User) {
    debugger
    this.selecttedPermissions = this.permissions.filter((val)=>user.PermissionUsers?.some(item=>item.PermissionId ==val.PermissionId))
    this.user= user
    this.userDialog = true;
    this.showPasswordInput = false;
    this.showNewPasswordInput = true;
  }
  saveUser() {
  this.submitted = true;

  if(this.user.Email?.trim() && this.user.Password?.trim()){
      if(this.user.Id){
        this.user.PermissionUsers = this.selecttedPermissions.map(a=>{
          return {
            UserId: this.user.Id,
            PermissionId: a.PermissionId
          }
        })
        this.crudService.updateItem("User/Update", this.user).subscribe(
          result =>{
            this.user.PermissionUsers = this.selecttedPermissions.map(item=>{
              return {
                PermissionId:item.PermissionId,
                Permission: {Name: item.Name}
              }
            })
            let index = this.users.findIndex(item=>item.Id==this.user.Id)
            this.users[index] = this.user;
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'User Updated', life: 3000 });
            this.users = [...this.users];
            this.userDialog = false;
            this.user = {};
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
        this.user.PermissionUsers = this.selecttedPermissions.map(a=>{
          return {
            PermissionId: a.PermissionId
          }
        })
        this.crudService.createItem('User/Create',this.user).subscribe(
          result=>{
            if(result == "ExistMail"){
              this.messageService.add({ severity: 'error', summary: 'Successful', detail: 'Email is existing', life: 3000 });
            }
            else{
              this.user.PermissionUsers = this.selecttedPermissions.map(a=>{
                return {
                  PermissionId: a.PermissionId,
                  Permission: {Name: a.Name}
                }
              })
              this.user.Id = result
              this.users.unshift(this.user);
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'User Created', life: 3000 });
            this.users = [...this.users];
            this.userDialog = false;
            this.user = {};
            }
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
  deleteUser(user: User){
      if(confirm(`Bạn có muốn xóa nhóm quyền ${user.FirstName} không?`)){
            this.crudService.deleteItem("User/Delete",user.Id).subscribe(
              data => {
                const index = this.users.indexOf(user);
                if (index !== -1) {
                  this.users.splice(index, 1);
                }
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'User Deleted', life: 3000 });
              },
              (error) => {
                  console.error('Error fetching apartment:', error);
              }
          );

      };
    }
    deleteSelectedUsers() {
      if(confirm(`Bạn có muốn xóa nhóm quyền không?`)){
      this.crudService.deleteMultipleItem("User/Deletemultiple",this.selectedUsers).subscribe(
        data=>{
          if(data){
            this.users = this.users.filter((val) => !this.selectedUsers?.includes(val));
            this.selectedUsers = null;
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'User Deleted', life: 3000 });
          }
          else{
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error', life: 3000 });

          }
        })
      }
    }
}