import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { Nav } from '../../../Navbar/Pages/nav/nav';
// import { Base } from '../../Services/base';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Base } from '../../Services/base';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-knowledge',
  imports: [CommonModule,Nav],
  templateUrl: './knowledge.html',
  styleUrl: './knowledge.scss',
})

export class Knowledge implements OnDestroy {
  isResetClicked: boolean = false;
  selectedFolder: File[] | null = null;
  isResetting: boolean = false;
  isUploading: boolean = false;

  private resetTimeout: any;
  private uploadTimeout: any;
  private subscriptions: Subscription[] = [];

  constructor(
    private baseService: Base,
    private snackBar: MatSnackBar
  ) {}

  ngOnDestroy(): void {
    // Clean up timeouts and subscriptions
    if (this.resetTimeout) clearTimeout(this.resetTimeout);
    if (this.uploadTimeout) clearTimeout(this.uploadTimeout);
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  handleReset(): void {
    const confirmMessage = 'Are you sure you want to reset the knowledge base? This will completely reset the knowledge base. You must upload a new folder after resetting.';
    
    if (!confirm(confirmMessage)) {
      return;
    }

    console.log('🔄 Starting reset...');
    this.isResetting = true;

    // SAFETY TIMEOUT - Force exit after 10 seconds NO MATTER WHAT
    this.resetTimeout = setTimeout(() => {
      if (this.isResetting) {
        console.warn('⏰ TIMEOUT: Forcing reset state to false');
        this.isResetting = false;
        this.snackBar.open('Reset request timed out. Please check your connection and try again.', 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['warning-snackbar']
        });
      }
    }, 10000);

    const sub = this.baseService.resetKnowledgeBase().subscribe({
      next: (response) => {
        console.log('✅ Reset successful:', response);
        
        // IMMEDIATELY STOP LOADING - FIRST THING!
        this.isResetting = false;
        if (this.resetTimeout) clearTimeout(this.resetTimeout);
        
        this.snackBar.open(response.message || 'Knowledge base reset successfully! You can now upload a new folder.', 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });
        
        // Enable upload section
        this.isResetClicked = true;
        
        // Clear any previously selected folder
        this.selectedFolder = null;
        const input = document.getElementById('folderInput') as HTMLInputElement;
        if (input) {
          input.value = '';
        }
      },
      error: (error) => {
        console.error('❌ Reset failed:', error);
        
        // IMMEDIATELY STOP LOADING - FIRST THING!
        this.isResetting = false;
        if (this.resetTimeout) clearTimeout(this.resetTimeout);
        
        const errorMessage = error?.error?.message || error?.message || 'Failed to reset knowledge base. Please try again.';
        this.snackBar.open(errorMessage, 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
        this.isResetClicked = false;
      },
      complete: () => {
        console.log('🏁 Reset complete');
        // Double safety check
        this.isResetting = false;
        if (this.resetTimeout) clearTimeout(this.resetTimeout);
      }
    });

    this.subscriptions.push(sub);
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
      console.warn('⚠️ Upload already in progress');
      return; // Prevent double submission
    }

    console.log('📤 Starting upload...');
    this.isUploading = true;

    // SAFETY TIMEOUT - Force exit after 30 seconds NO MATTER WHAT
    this.uploadTimeout = setTimeout(() => {
      if (this.isUploading) {
        console.warn('⏰ TIMEOUT: Forcing upload state to false');
        this.isUploading = false;
        this.snackBar.open('Upload request timed out. Please check your connection and try again.', 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['warning-snackbar']
        });
      }
    }, 30000);

    // Create FormData to send files
    const formData = new FormData();
    this.selectedFolder.forEach((file) => {
      formData.append('files', file);
    });

    console.log('Uploading folder with', this.selectedFolder.length, 'files');

    const sub = this.baseService.uploadAndIngest(formData).subscribe({
      next: (response) => {
        console.log('✅ Upload successful:', response);
        
        // IMMEDIATELY STOP LOADING - FIRST THING!
        this.isUploading = false;
        if (this.uploadTimeout) clearTimeout(this.uploadTimeout);
        
        this.snackBar.open(response.message || 'Files uploaded and ingested successfully!', 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });
        
        // Reset state after successful upload
        this.isResetClicked = false;
        this.selectedFolder = null;
        
        // Reset file input
        const input = document.getElementById('folderInput') as HTMLInputElement;
        if (input) {
          input.value = '';
        }
      },
      error: (error) => {
        console.error('❌ Upload failed:', error);
        
        // IMMEDIATELY STOP LOADING - FIRST THING!
        this.isUploading = false;
        if (this.uploadTimeout) clearTimeout(this.uploadTimeout);
        
        const errorMessage = error?.error?.message || error?.message || 'Upload failed. Please try again.';
        this.snackBar.open(errorMessage, 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      },
      complete: () => {
        console.log('🏁 Upload complete');
        // Double safety check
        this.isUploading = false;
        if (this.uploadTimeout) clearTimeout(this.uploadTimeout);
      }
    });

    this.subscriptions.push(sub);
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