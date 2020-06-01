import { EditProfileComponent } from './pages/edit-profile/edit-profile.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AuthGuard } from './guards/auth.guard';
import { ChatComponent } from './pages/chat/chat.component';
import { LoginComponent } from './pages/login/login.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';
import { SignupComponent } from './pages/signup/signup.component';
import { IsOwnerGuard } from './guards/is-owner.guard';

const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: '/login'},
  {path: 'login', component: LoginComponent },
  {path: 'signup', component: SignupComponent},
  {path: 'chat', canActivate: [AuthGuard],
    children: [
      {path : '', component: ChatComponent},
      {path: ':chatroomId', component: ChatComponent}
    ]
  },
  {path: 'profile/:userId', component: ProfileComponent, canActivate: [AuthGuard]},
  {path: 'profile/:userId/edit', component: EditProfileComponent, canActivate: [AuthGuard, IsOwnerGuard]},
  {path: '**', redirectTo: '/login'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
