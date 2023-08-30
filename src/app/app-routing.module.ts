import { ResidentComponent } from './resident/resident.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductComponent } from './product/product.component';
import { AppComponent } from './app.component';
import { StudentsComponent } from './students/students.component';
import { CustomerComponent } from './customer/customer.component';
import { LoginComponent } from './login/login.component';
import { authGuard } from './auth.guard';
import { HomeComponent } from './home/home.component';
import { ApartmentComponent } from './apartment/apartment.component';
import { PermissionComponent } from './permission/permission.component';
import { User } from './domain/User';
import { UserComponent } from './user/user.component';
import { UrbanareaComponent } from './urbanarea/urbanarea.component';
import { AddressComponent } from './address/address.component';
import { BuildingcategoryComponent } from './buildingcategory/buildingcategory.component';
const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'customers', component: CustomerComponent,canActivate:[authGuard],data:{requiredRole:'Customer_GetAll'} },
  { path: 'residents', component: ResidentComponent,canActivate:[authGuard],data:{requiredRole:'Resident_GetAll'} },
  { path: 'apartments', component: ApartmentComponent,canActivate:[authGuard],data:{requiredRole:'Apartment_GetAll'} },
  { path: 'permissions', component: PermissionComponent,canActivate:[authGuard],data:{requiredRole:'Permission_GetAll'} },
  { path: 'users', component: UserComponent,canActivate:[authGuard],data:{requiredRole:'User_GetAll'}},
  {path:'urbanarea', component:UrbanareaComponent,canActivate:[authGuard],data:{requiredRole:'UrbanArea_GetAll'}},
  {path:'address', component:AddressComponent,canActivate:[authGuard],data:{requiredRole:'Address_GetAll'}},
  {path:'buildingcategory', component:BuildingcategoryComponent,canActivate:[authGuard],data:{requiredRole:'BuildingCategory_GetAll'}}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
