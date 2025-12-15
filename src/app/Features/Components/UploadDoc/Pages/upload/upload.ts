import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Nav } from '../../../Navbar/Pages/nav/nav';
import { Up } from '../../Services/up';
import Swal from 'sweetalert2';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-upload',
  imports: [CommonModule,FormsModule,Nav,RouterLink],
  templateUrl: './upload.html',
  styleUrl: './upload.scss',
})



export class Upload {
  selectedDepartment: string = 'Facilities';
  dragActive: boolean = false;
  selectedFile: File | null = null;
  isUploading: boolean = false;
  uploadSuccess: boolean = false;
  uploadError: string = '';

  constructor(
    private uploadService: Up,
    private cdr: ChangeDetectorRef
  ) {}

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
      
      Swal.fire({
        icon: 'error',
        title: 'Invalid File Type',
        text: 'Please upload a PDF or DOCX file.',
        confirmButtonColor: '#f97316'
      });
      return;
    }

    if (file.size > maxSize) {
      this.uploadError = 'File size must be less than 10MB.';
      this.selectedFile = null;
      
      Swal.fire({
        icon: 'error',
        title: 'File Too Large',
        text: 'File size must be less than 10MB.',
        confirmButtonColor: '#f97316'
      });
      return;
    }
  }

  handleUpload(): void {
    if (!this.selectedFile) {
      this.uploadError = 'Please select a file to upload.';
      
      Swal.fire({
        icon: 'warning',
        title: 'No File Selected',
        text: 'Please select a file to upload.',
        confirmButtonColor: '#f97316'
      });
      return;
    }

    if (this.isUploading) return;

    const fileName = this.selectedFile.name;
    const dept = this.selectedDepartment;

    this.isUploading = true;
    this.uploadSuccess = false;
    this.uploadError = '';
    this.cdr.detectChanges(); // Force UI update

    Swal.fire({
      title: 'Uploading Document',
      html: `Uploading <strong>${fileName}</strong>...`,
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.uploadService.uploadDocument(this.selectedFile, this.selectedDepartment).subscribe({
      next: (response) => {
        this.isUploading = false;
        this.uploadSuccess = true;
        this.cdr.detectChanges(); // Force UI update
        
        Swal.fire({
          icon: 'success',
          title: 'Upload Successful!',
          html: `<strong>${fileName}</strong> uploaded to ${dept} department successfully!`,
          confirmButtonColor: '#f97316'
        });

        this.selectedFile = null;
        const fileInput = document.querySelector('.file-input') as HTMLInputElement;
        if (fileInput) fileInput.value = '';

        setTimeout(() => {
          this.uploadSuccess = false;
          this.cdr.detectChanges();
        }, 5000);
      },
      error: (error) => {
        this.isUploading = false;
        this.uploadError = error?.error?.message || 'Upload failed. Please try again.';
        this.cdr.detectChanges(); // Force UI update
        
        Swal.fire({
          icon: 'error',
          title: 'Upload Failed',
          text: this.uploadError,
          confirmButtonColor: '#f97316'
        });
      },
      complete: () => {
        this.isUploading = false;
        this.cdr.detectChanges(); // Force UI update
      }
    });
  }
}