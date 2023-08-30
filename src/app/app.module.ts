import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductComponent } from './product/product.component';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { FileUploadModule } from 'primeng/fileupload';
import { RatingModule } from 'primeng/rating';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ProductService } from './service/product.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Import BrowserAnimationsModule
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { StudentsComponent } from './students/students.component';
import { CalendarModule } from 'primeng/calendar';
import { StudentService } from './service/student.service';
import { CheckboxModule } from 'primeng/checkbox';
import { CustomerComponent } from './customer/customer.component';
import { CrudService } from './service/crud.service';
import { LoginComponent } from './login/login.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Interceptor } from './interceptor';
import { authGuard } from './auth.guard';
import { JwtHelperService } from '@auth0/angular-jwt';
import { JwtModule } from '@auth0/angular-jwt';
import { JWT_OPTIONS } from '@auth0/angular-jwt';
import { HomeComponent } from './home/home.component';
import { ResidentComponent } from './resident/resident.component';
import { ApartmentComponent } from './apartment/apartment.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { PermissionComponent } from './permission/permission.component';
import { UserComponent } from './user/user.component';
import { UrbanareaComponent } from './urbanarea/urbanarea.component';
import { AddressComponent } from './address/address.component';
import { BuildingcategoryComponent } from './buildingcategory/buildingcategory.component';

export function jwtOptionsFactory() {
  return {
    tokenGetter: () => localStorage.getItem('access-token'),
    allowedDomains: ['https://localhost:7021'] // Adjust to your API domain(s)
  };
}
@NgModule({
  declarations: [
    AppComponent,
    ProductComponent,
    StudentsComponent,
    CustomerComponent,
    LoginComponent,
    HomeComponent,
    ResidentComponent,
    ApartmentComponent,
    PermissionComponent,
    UserComponent,
    UrbanareaComponent,
    AddressComponent,
    BuildingcategoryComponent
  ],
  imports: [
    MultiSelectModule,
    CheckboxModule,
    InputTextareaModule,
    InputTextModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ButtonModule,
    TableModule,
    ToastModule,
    ToolbarModule,
    FileUploadModule,
    RatingModule,
    TagModule,
    DialogModule,
    DropdownModule,
    RadioButtonModule,
    InputNumberModule,
    ConfirmDialogModule,
    FormsModule,
    CalendarModule,
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory
      }
    })
  ],
  providers: [JwtHelperService,ProductService,StudentService,CrudService,{provide: HTTP_INTERCEPTORS,useClass:Interceptor,multi:true}],
  bootstrap: [AppComponent,ProductComponent]
  
})
export class AppModule { }
