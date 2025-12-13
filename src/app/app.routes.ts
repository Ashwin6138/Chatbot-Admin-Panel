import { Routes } from '@angular/router';
import { Login } from './Features/Components/Login/Pages/login/login';
import { Stats } from './Features/Components/DailyStats/Pages/stats/stats';
import { Upload } from './Features/Components/UploadDoc/Pages/upload/upload';
import { Knowledge } from './Features/Components/KnowledgeBase/Pages/knowledge/knowledge';
import { conv } from './Features/Components/Conversations/Pages/conv/conv';
import { AuthGuard } from './Core/Guards/auth-guard';




export const routes: Routes = [
  
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path:'login',component:Login},
  { path: 'stats', component: Stats, canActivate: [AuthGuard] },
  { path: 'upload', component: Upload, canActivate: [AuthGuard] },
  { path: 'knowledge', component: Knowledge, canActivate: [AuthGuard] },
  { path: 'conversation', component: conv, canActivate: [AuthGuard] }

];
