import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ApiService } from './api.service';

import {

ManagerDashboard,
FinanceDashboard,
EmployeeDashboard

}

from '../models/dashboard.model';



@Injectable({

providedIn:'root'

})

export class DashboardService{


constructor(

private api:ApiService

)
{

}



getManagerDashboard():

Observable<ManagerDashboard>
{

return this.api.get<ManagerDashboard>(

'Dashboard/manager'

);

}




getFinanceDashboard():

Observable<FinanceDashboard>
{

return this.api.get<FinanceDashboard>(

'Dashboard/finance'

);

}




getEmployeeDashboard(

id:number

):

Observable<EmployeeDashboard>
{

return this.api.get<EmployeeDashboard>(

`Dashboard/employee/${id}`

);

}


}