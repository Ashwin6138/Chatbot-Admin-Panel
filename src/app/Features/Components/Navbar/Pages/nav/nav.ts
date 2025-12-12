import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import {  materialmodule } from '../../../../../Shared/Modules/materialmodule';

@Component({
  selector: 'app-nav',
  imports: [materialmodule],
  templateUrl: './nav.html',
  styleUrl: './nav.scss',
})
export class Nav {

  constructor(
    private router: Router, 
    private snackBar: MatSnackBar
  ) {}

  openLogoutDialog(): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to logout?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.logout();
      }
    });
  }

  logout(): void {
    // Clear storage
    localStorage.clear();
    sessionStorage.clear();

    // Show success message
    Swal.fire({
      title: 'Logged Out!',
      text: 'You have been successfully logged out.',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false
    });

    // Redirect to login page after delay
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 1500);
  }
}

