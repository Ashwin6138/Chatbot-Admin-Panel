import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, tap, throwError, timeout } from 'rxjs';
import { environment } from '../../../../Core/Environments/environment';

export interface UploadResponse {
  status: string;
  message: string;
  path: string;
}

@Injectable({
  providedIn: 'root'
})
export class Up {
//   private apiUrl = 'https://vashti-unseethed-adjectively.ngrok-free.app/admin/upload';
//  private readonly PREVIEW_BASE_URL = environment.PREVIEW_BASE_URL;
//   constructor(private http: HttpClient) {}



// uploadDocument(file: File, department: string): Observable<UploadResponse> {
//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('department', department);

    

//     return this.http.post<UploadResponse>(this.apiUrl, formData);
//   }

private apiUrl = `${environment.PREVIEW_BASE_URL}/admin/upload`;

  constructor(private http: HttpClient) {}

  uploadDocument(file: File, department: string): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('department', department);

    return this.http.post<UploadResponse>(this.apiUrl, formData);
  }
}



