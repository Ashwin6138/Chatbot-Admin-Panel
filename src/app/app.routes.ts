import { Routes } from '@angular/router';
import { Login } from './Features/Components/Login/Pages/login/login';
import { Stats } from './Features/Components/DailyStats/Pages/stats/stats';
import { Upload } from './Features/Components/UploadDoc/Pages/upload/upload';
import { Knowledge } from './Features/Components/KnowledgeBase/Pages/knowledge/knowledge';
import { conv } from './Features/Components/Conversations/Pages/conv/conv';




export const routes: Routes = [
  
    {path: '', redirectTo: 'login', pathMatch: 'full'},
 
    {path:'login',component:Login},

    {path:'stats',component:Stats},

    {path:'upload',component:Upload},

    {path: 'knowledge', component: Knowledge },

    {path: 'conversation', component: conv },



];
