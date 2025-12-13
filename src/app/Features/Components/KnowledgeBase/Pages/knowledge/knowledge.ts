import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Nav } from '../../../Navbar/Pages/nav/nav';
import { Base } from '../../Services/base';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-knowledge',
  imports: [CommonModule,Nav],
  templateUrl: './knowledge.html',
  styleUrl: './knowledge.scss',
})

export class Knowledge {
  isResetClicked: boolean = false;
  selectedFolder: File[] | null = null;
  isResetting: boolean = false;
  isUploading: boolean = false;

  constructor(
    private baseService: Base,
    private snackBar: MatSnackBar
  ) {}

  handleReset(): void {
    const confirmMessage = 'Are you sure you want to reset the knowledge base? This will completely reset the knowledge base. You must upload a new folder after resetting.';
    
    if (confirm(confirmMessage)) {
      this.isResetting = true;
      
      this.baseService.resetKnowledgeBase().subscribe({
        next: (response) => {
          console.log('Reset successful:', response);
          this.snackBar.open(response.message || 'Knowledge base reset successfully! You can now upload a new folder.', 'Close', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['success-snackbar']
          });
          
          // Enable upload section
          this.isResetClicked = true;
          this.isResetting = false;
          
          // Clear any previously selected folder
          this.selectedFolder = null;
          const input = document.getElementById('folderInput') as HTMLInputElement;
          if (input) {
            input.value = '';
          }
        },
        error: (error) => {
          console.error('Reset failed:', error);
          const errorMessage = error?.error?.message || 'Failed to reset knowledge base. Please try again.';
          this.snackBar.open(errorMessage, 'Close', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
          });
          this.isResetting = false;
          this.isResetClicked = false;
        }
      });
    }
  }

  handleFolderSelect(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.selectedFolder = Array.from(target.files);
      console.log('Selected files:', this.selectedFolder.length, 'files');
    } else {
      this.selectedFolder = null;
    }
  }

  handleUploadAndReingest(): void {
    if (!this.isResetClicked) {
      this.snackBar.open('Please reset the knowledge base first.', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['warning-snackbar']
      });
      return;
    }

    if (!this.selectedFolder || this.selectedFolder.length === 0) {
      this.snackBar.open('Please select a folder to upload.', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['warning-snackbar']
      });
      return;
    }

    if (this.isUploading) {
      return; // Prevent double submission
    }

    this.isUploading = true;

    // Create FormData to send files
    const formData = new FormData();
    this.selectedFolder.forEach((file) => {
      formData.append('files', file);
    });

    console.log('Uploading folder with', this.selectedFolder.length, 'files');

    this.baseService.uploadAndIngest(formData).subscribe({
      next: (response) => {
        console.log('Upload successful:', response);
        this.snackBar.open(response.message || 'Files uploaded and ingested successfully!', 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });
        
        // Reset state after successful upload
        this.isResetClicked = false;
        this.selectedFolder = null;
        this.isUploading = false;
        
        // Reset file input
        const input = document.getElementById('folderInput') as HTMLInputElement;
        if (input) {
          input.value = '';
        }
      },
      error: (error) => {
        console.error('Upload failed:', error);
        const errorMessage = error?.error?.message || 'Upload failed. Please try again.';
        this.snackBar.open(errorMessage, 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
        this.isUploading = false;
      }
    });
  }

  triggerFolderInput(): void {
    if (!this.isResetClicked) {
      this.snackBar.open('Please reset the knowledge base first.', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['warning-snackbar']
      });
      return;
    }
    
    const input = document.getElementById('folderInput') as HTMLInputElement;
    input?.click();
  }

  // Helper method to check if upload section should be enabled
  get canUpload(): boolean {
    return this.isResetClicked && !this.isUploading;
  }

  // Helper method to check if upload button should be enabled
  get canSubmitUpload(): boolean {
    return this.isResetClicked && 
           !this.isUploading && 
           this.selectedFolder !== null && 
           this.selectedFolder.length > 0;
  }
}