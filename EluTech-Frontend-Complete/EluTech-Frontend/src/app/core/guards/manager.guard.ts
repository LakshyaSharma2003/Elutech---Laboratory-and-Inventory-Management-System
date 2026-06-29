import {

CanActivateFn

}

from '@angular/router';



import {

inject

}

from '@angular/core';



import {

Router

}

from '@angular/router';



import {

AuthService

}

from '../services/auth.service';




export const managerGuard:

CanActivateFn=()=>{


const auth=

inject(AuthService);



const router=

inject(Router);




if(

auth.role()==='Manager'

)
{


return true;


}



router.navigate(

['/login']

);



return false;



};