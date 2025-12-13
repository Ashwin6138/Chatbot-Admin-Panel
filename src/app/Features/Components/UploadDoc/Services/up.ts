import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, tap, throwError, timeout } from 'rxjs';

export interface UploadResponse {
  status: string;
  message: string;
  path: string;
}

@Injectable({
  providedIn: 'root'
})
export class Up {
  private apiUrl = 'https://vashti-unseethed-adjectively.ngrok-free.app/admin/upload';

  constructor(private http: HttpClient) {}

 uploadDocument(file: File, department: string): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('department', department);

    const headers = new HttpHeaders({
      'ngrok-skip-browser-warning': 'true'
    });

    console.log('📤 Uploading to:', this.apiUrl);
    console.log('📄 File:', file.name);
    console.log('🏢 Department:', department);

    return this.http.post<UploadResponse>(this.apiUrl, formData, { headers }).pipe(
      tap(response => console.log('✅ Upload successful:', response)),
      catchError(error => {
        console.error('❌ Upload error:', error);
        return throwError(() => ({
          error: { 
            message: error?.error?.message || error?.message || 'Upload failed. Please try again.' 
          }
        }));
      })
    );
  }
}

