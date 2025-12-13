import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { Nav } from '../../../Navbar/Pages/nav/nav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Base } from '../../Services/base';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-knowledge',
  imports: [CommonModule,Nav,RouterLink],
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

  constructor(
    private baseService: Base,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnDestroy(): void {
    if (this.resetTimeout) clearTimeout(this.resetTimeout);
    if (this.uploadTimeout) clearTimeout(this.uploadTimeout);
  }

  handleReset(): void {
    Swal.fire({
      title: 'Reset Knowledge Base?',
      text: 'This will completely reset the knowledge base. You must upload a new folder after resetting.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f97316',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, reset it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.performReset();
      }
    });
  }

  private performReset(): void {
    console.log('🔄 Starting reset...');
    this.isResetting = true;
    this.cdr.detectChanges();

    // SAFETY TIMEOUT - Force exit after 10 seconds
    this.resetTimeout = setTimeout(() => {
      if (this.isResetting) {
        console.warn('⏰ TIMEOUT: Forcing reset state to false');
        this.isResetting = false;
        this.cdr.detectChanges();
        Swal.fire({
          title: 'Timeout!',
          text: 'Reset request timed out. Please check your connection and try again.',
          icon: 'warning',
          confirmButtonColor: '#f97316'
        });
      }
    }, 10000);

    this.baseService.resetKnowledgeBase().subscribe({
      next: (response) => {
        console.log('✅ Reset successful:', response);
        
        this.isResetting = false;
        if (this.resetTimeout) clearTimeout(this.resetTimeout);
        
        Swal.fire({
          title: 'Success!',
          text: response.message || 'Knowledge base reset successfully! You can now upload a new folder.',
          icon: 'success',
          confirmButtonColor: '#f97316',
          confirmButtonText: 'OK'
        });
        
        // Enable upload section
        this.isResetClicked = true;
        
        // Clear any previously selected folder
        this.selectedFolder = null;
        const input = document.getElementById('folderInput') as HTMLInputElement;
        if (input) {
          input.value = '';
        }
        
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('❌ Reset failed:', error);
        
        this.isResetting = false;
        if (this.resetTimeout) clearTimeout(this.resetTimeout);
        
        const errorMessage = error?.error?.message || error?.message || 'Failed to reset knowledge base. Please try again.';
        Swal.fire({
          title: 'Error!',
          text: errorMessage,
          icon: 'error',
          confirmButtonColor: '#f97316'
        });
        this.isResetClicked = false;
        this.cdr.detectChanges();
      },
      complete: () => {
        console.log('🏁 Reset complete');
        this.isResetting = false;
        if (this.resetTimeout) clearTimeout(this.resetTimeout);
        this.cdr.detectChanges();
      }
    });
  }

  handleFolderSelect(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.selectedFolder = Array.from(target.files);
      console.log('Selected files:', this.selectedFolder.length, 'files');
      
      // Show success alert with file count
      Swal.fire({
        title: 'Files Selected!',
        text: `Successfully selected ${this.selectedFolder.length} file${this.selectedFolder.length !== 1 ? 's' : ''}`,
        icon: 'success',
        confirmButtonColor: '#f97316',
        timer: 2000,
        showConfirmButton: false
      });
      
      this.cdr.detectChanges();
    } else {
      this.selectedFolder = null;
      this.cdr.detectChanges();
    }
  }

  handleUploadAndReingest(): void {
    if (!this.isResetClicked) {
      Swal.fire({
        title: 'Reset Required!',
        text: 'Please reset the knowledge base first.',
        icon: 'warning',
        confirmButtonColor: '#f97316'
      });
      return;
    }

    if (!this.selectedFolder || this.selectedFolder.length === 0) {
      Swal.fire({
        title: 'No Folder Selected!',
        text: 'Please select a folder to upload.',
        icon: 'warning',
        confirmButtonColor: '#f97316'
      });
      return;
    }

    if (this.isUploading) {
      console.warn('⚠️ Upload already in progress');
      return;
    }

    console.log('📤 Starting upload...');
    console.log('Selected files:', this.selectedFolder);
    this.isUploading = true;
    this.cdr.detectChanges();

    // Show loading alert
    Swal.fire({
      title: 'Uploading...',
      text: `Uploading ${this.selectedFolder.length} file${this.selectedFolder.length !== 1 ? 's' : ''}...`,
      icon: 'info',
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    // SAFETY TIMEOUT - Force exit after 30 seconds
    this.uploadTimeout = setTimeout(() => {
      if (this.isUploading) {
        console.warn('⏰ TIMEOUT: Forcing upload state to false');
        this.isUploading = false;
        this.cdr.detectChanges();
        Swal.fire({
          title: 'Timeout!',
          text: 'Upload request timed out. Please check your connection and try again.',
          icon: 'warning',
          confirmButtonColor: '#f97316'
        });
      }
    }, 30000);

    const formData = new FormData();
    
    // Server expects 'file' (singular), not 'files' (plural)
    // Add each file individually with the same field name
    this.selectedFolder.forEach((file, index) => {
      console.log(`Adding file ${index + 1}:`, {
        name: file.name,
        size: file.size,
        type: file.type,
        webkitRelativePath: (file as any).webkitRelativePath
      });
      // Use 'file' as the field name (what the server expects)
      formData.append('file', file, file.name);
    });

    console.log('FormData created with', this.selectedFolder.length, 'files');

    this.baseService.uploadAndIngest(formData).subscribe({
      next: (response) => {
        console.log('✅ Upload successful:', response);
        
        this.isUploading = false;
        if (this.uploadTimeout) clearTimeout(this.uploadTimeout);
        
        Swal.fire({
          title: 'Success!',
          text: response.message || 'Files uploaded and ingested successfully!',
          icon: 'success',
          confirmButtonColor: '#f97316',
          confirmButtonText: 'OK'
        });
        
        // Reset state after successful upload
        this.isResetClicked = false;
        this.selectedFolder = null;
        
        const input = document.getElementById('folderInput') as HTMLInputElement;
        if (input) {
          input.value = '';
        }
        
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('❌ Upload failed:', error);
        console.error('Error status:', error.status);
        console.error('Error details:', error.error);
        
        this.isUploading = false;
        if (this.uploadTimeout) clearTimeout(this.uploadTimeout);
        
        let errorMessage = 'Upload failed. Please try again.';
        
        // Handle 422 errors specifically
        if (error.status === 422) {
          if (error.error?.message) {
            errorMessage = error.error.message;
          } else if (error.error?.detail) {
            errorMessage = error.error.detail;
          } else {
            errorMessage = 'Invalid file format or data. Please check your files and try again.';
          }
          console.error('422 Validation error details:', error.error);
        } else {
          errorMessage = error?.error?.message || error?.message || errorMessage;
        }
        
        Swal.fire({
          title: 'Upload Failed!',
          html: `<p><strong>Error ${error.status || 'Unknown'}:</strong></p><p>${errorMessage}</p>`,
          icon: 'error',
          confirmButtonColor: '#f97316'
        });
        this.cdr.detectChanges();
      },
      complete: () => {
        console.log('🏁 Upload complete');
        this.isUploading = false;
        if (this.uploadTimeout) clearTimeout(this.uploadTimeout);
        this.cdr.detectChanges();
      }
    });
  }

  triggerFolderInput(): void {
    if (!this.isResetClicked) {
      Swal.fire({
        title: 'Reset Required!',
        text: 'Please reset the knowledge base first.',
        icon: 'warning',
        confirmButtonColor: '#f97316'
      });
      return;
    }
    
    const input = document.getElementById('folderInput') as HTMLInputElement;
    input?.click();
  }

  get canUpload(): boolean {
    return this.isResetClicked && !this.isUploading;
  }

  get canSubmitUpload(): boolean {
    return this.isResetClicked && 
           !this.isUploading && 
           this.selectedFolder !== null && 
           this.selectedFolder.length > 0;
  }
}