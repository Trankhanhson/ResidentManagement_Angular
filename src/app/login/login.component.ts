import { User } from './../domain/User';
import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { HttpClient,HttpErrorResponse  } from '@angular/common/http';
import { ShareDataService } from '../service/share-data.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})  
export class LoginComponent {

  user: User = {};
  roles: User[]=[{Role:'Resident'},{Role:'Admin'},{Role:'Customer'},{Role:'Apartment'}];
  selectedRoles: User[]=[];
  constructor(private authService: AuthService,private router: Router,private shareData: ShareDataService){}
  register(){
    if (this.selectedRoles.length > 0) {
      this.user.Role = this.selectedRoles.map(role => role.Role).join(', ');
  } else {
    this.user.Role = '';
  }
    this.authService.register(this.user).subscribe(data=>{
      if(data){
         alert("Success")
      }
      else{
        alert("Error occurred")
      }
    })
  }

  login(){

    this.authService.login(this.user).subscribe((data:any)=>{
      debugger
      let result = JSON.parse(data)
      sessionStorage.setItem('access-token',result.token)
      sessionStorage.setItem('permissions',JSON.stringify(result.permissions))
      this.shareData.setSharedData({permissions:result.permissions, tab: 'home'})
      this.router.navigate(["/home"])
    },
    (error: HttpErrorResponse) => {
        if (error.status === 401) {
            // Handle 401 Unauthorized
            alert('Unauthorized access');
        } else {
            // Handle other errors
            console.error('An error occurred:', error.error);
        }
    }
    )
  }

}
