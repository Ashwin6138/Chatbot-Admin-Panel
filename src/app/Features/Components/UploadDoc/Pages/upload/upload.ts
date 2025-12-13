import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Nav } from '../../../Navbar/Pages/nav/nav';
import { Up } from '../../Services/up';

@Component({
  selector: 'app-upload',
  imports: [CommonModule,FormsModule,Nav],
  templateUrl: './upload.html',
  styleUrl: './upload.scss',
})




// export class Upload {
//   activeTab: string = 'upload';
//   selectedDepartment: string = 'BYT';
//   dragActive: boolean = false;
//   selectedFile: File | null = null;

//   setActiveTab(tab: string): void {
//     this.activeTab = tab;
//     console.log('Active tab:', tab);
//     // You can add navigation logic here based on the selected tab
//   }

//   handleDrag(event: DragEvent): void {
//     event.preventDefault();
//     event.stopPropagation();

//     if (event.type === 'dragenter' || event.type === 'dragover') {
//       this.dragActive = true;
//     } else if (event.type === 'dragleave') {
//       this.dragActive = false;
//     }
//   }

//   handleDrop(event: DragEvent): void {
//     event.preventDefault();
//     event.stopPropagation();
//     this.dragActive = false;

//     if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
//       this.selectedFile = event.dataTransfer.files[0];
//       this.validateFile(this.selectedFile);
//     }
//   }

//   handleFileChange(event: Event): void {
//     const target = event.target as HTMLInputElement;
//     if (target.files && target.files.length > 0) {
//       this.selectedFile = target.files[0];
//       this.validateFile(this.selectedFile);
//     }
//   }

//   validateFile(file: File): void {
//     const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
//     const maxSize = 10 * 1024 * 1024; // 10MB

//     if (!allowedTypes.includes(file.type)) {
//       alert('Please upload a PDF or DOCX file.');
//       this.selectedFile = null;
//       return;
//     }

//     if (file.size > maxSize) {
//       alert('File size must be less than 10MB.');
//       this.selectedFile = null;
//       return;
//     }
//   }

//   handleUpload(): void {
//     if (!this.selectedFile) {
//       alert('Please select a file to upload.');
//       return;
//     }

//     // Create FormData to send file
//     const formData = new FormData();
//     formData.append('file', this.selectedFile);
//     formData.append('department', this.selectedDepartment);

//     console.log('Uploading file:', this.selectedFile.name);
//     console.log('Department:', this.selectedDepartment);

//     // Here you would typically call your upload service
//     // Example:
//     // this.uploadService.uploadDocument(formData).subscribe(
//     //   response => {
//     //     console.log('Upload successful', response);
//     //     this.selectedFile = null;
//     //   },
//     //   error => {
//     //     console.error('Upload failed', error);
//     //   }
//     // );

//     // For demo purposes, show success message
//     alert(`File "${this.selectedFile.name}" uploaded successfully to ${this.selectedDepartment} department!`);
//     this.selectedFile = null;
//   }
// }



export class Upload {
  selectedDepartment: string = 'BYT';
  dragActive: boolean = false;
  selectedFile: File | null = null;
  isUploading: boolean = false;
  uploadSuccess: boolean = false;
  uploadError: string = '';

  constructor(private uploadService: Up) {}

  handleDrag(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    if (event.type === 'dragenter' || event.type === 'dragover') {
      this.dragActive = true;
    } else if (event.type === 'dragleave') {
      this.dragActive = false;
    }
  }

  handleDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragActive = false;

    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.selectedFile = event.dataTransfer.files[0];
      this.validateFile(this.selectedFile);
    }
  }

  handleFileChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.selectedFile = target.files[0];
      this.validateFile(this.selectedFile);
    }
  }

  validateFile(file: File): void {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    const maxSize = 10 * 1024 * 1024; // 10MB

    this.uploadSuccess = false;
    this.uploadError = '';

    if (!allowedTypes.includes(file.type)) {
      this.uploadError = 'Please upload a PDF or DOCX file.';
      this.selectedFile = null;
      return;
    }

    if (file.size > maxSize) {
      this.uploadError = 'File size must be less than 10MB.';
      this.selectedFile = null;
      return;
    }
  }

  handleUpload(): void {
    if (!this.selectedFile) {
      this.uploadError = 'Please select a file to upload.';
      return;
    }

    if (this.isUploading) {
      console.warn('⚠️ Upload already in progress');
      return;
    }

    console.log('🚀 Starting upload...', this.selectedFile.name);

    this.isUploading = true;
    this.uploadSuccess = false;
    this.uploadError = '';

    const uploadSubscription = this.uploadService
      .uploadDocument(this.selectedFile, this.selectedDepartment)
      .subscribe({
        next: (response) => {
          console.log('✅ Upload successful:', response);
          this.isUploading = false;
          this.uploadSuccess = true;

          alert(response.message || 'File uploaded successfully!');

          // Reset form
          this.selectedFile = null;

          // Clear file input
          const fileInput = document.querySelector('.file-input') as HTMLInputElement;
          if (fileInput) {
            fileInput.value = '';
          }

          // Auto-hide success message after 5 seconds
          setTimeout(() => {
            this.uploadSuccess = false;
          }, 5000);
        },
        error: (error) => {
          console.error('❌ Upload failed:', error);
          this.isUploading = false;
          this.uploadError = error?.error?.message || 'Upload failed. Please try again.';
          alert(`Upload failed: ${this.uploadError}`);
        },
        complete: () => {
          console.log('🏁 Upload observable completed');
          // Safety check - this should already be false from next/error
          if (this.isUploading) {
            console.warn('⚠️ isUploading still true in complete - forcing to false');
            this.isUploading = false;
          }
        }
      });

    // Safety timeout - force stop loading after 30 seconds
    setTimeout(() => {
      if (this.isUploading) {
        console.error('⏰ Upload timeout - forcing stop');
        this.isUploading = false;
        this.uploadError = 'Upload timed out. Please try again.';
        uploadSubscription.unsubscribe();
      }
    }, 30000);
  }
}