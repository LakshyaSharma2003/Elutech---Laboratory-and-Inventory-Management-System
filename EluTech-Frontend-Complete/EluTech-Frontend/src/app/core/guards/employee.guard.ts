import {
CanActivateFn
} from '@angular/router';

import {
inject
} from '@angular/core';

import {
Router
} from '@angular/router';

import {
AuthService
} from '../services/auth.service';



export const employeeGuard:
CanActivateFn = () => {


const auth =
inject(AuthService);


const router =
inject(Router);



const role =
auth.role();




if(

role === 'Manager'

||

role === 'Employee'

)

{

return true;

}



router.navigate(

['/login']

);


return false;


};