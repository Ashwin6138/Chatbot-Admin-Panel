import { Routes } from '@angular/router';
import { Login } from './Features/Components/Login/Pages/login/login';
import { Stats } from './Features/Components/DailyStats/Pages/stats/stats';




export const routes: Routes = [
  
    {path: '', redirectTo: 'login', pathMatch: 'full'},
 
    {path:'login',component:Login},

    {path:'stats',component:Stats},

];
