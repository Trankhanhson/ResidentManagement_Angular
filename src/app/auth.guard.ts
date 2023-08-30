import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  var jwt = inject(JwtHelperService)
  const token = sessionStorage.getItem('access-token');
  if (token && !jwt.isTokenExpired(token)){
    debugger
    const dataPermissions = sessionStorage.getItem('permissions')||""
    const listPermission = JSON.parse(dataPermissions);
    const requredRole = route.data['requiredRole']
    if(listPermission && (listPermission.includes(requredRole) || listPermission.includes("Admin"))){
      return true;
    }
    else{
      alert("you don't have permission")
      return false;
    }
  }
  else{
    router.navigate(["/login"]);
    return false;
  }
};



