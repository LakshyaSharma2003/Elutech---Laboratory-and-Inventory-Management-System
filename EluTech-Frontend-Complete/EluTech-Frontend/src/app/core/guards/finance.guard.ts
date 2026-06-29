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



export const financeGuard:
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

role === 'FinanceOfficer'

)

{

return true;

}



router.navigate(

['/login']

);


return false;


};