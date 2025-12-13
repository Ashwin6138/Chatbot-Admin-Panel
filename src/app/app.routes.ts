import { Routes } from '@angular/router';
import { Login } from './Features/Components/Login/Pages/login/login';
import { Stats } from './Features/Components/DailyStats/Pages/stats/stats';
import { Dash } from './Features/Components/Dashboard/Pages/dash/dash';
import { Upload } from './Features/Components/UploadDoc/Pages/upload/upload';
import { Knowledge } from './Features/Components/KnowledgeBase/Pages/knowledge/knowledge';




export const routes: Routes = [
  
    {path: '', redirectTo: 'login', pathMatch: 'full'},
 
    {path:'login',component:Login},

    {path:'stats',component:Stats},

    {path:'dash',component:Dash},

    {path:'upload',component:Upload},

    {path: 'knowledge', component: Knowledge },


];
