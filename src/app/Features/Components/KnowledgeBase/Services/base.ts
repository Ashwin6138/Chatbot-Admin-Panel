// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root',
// })
// export class Base {
  
// }



import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, tap } from 'rxjs';
import { environment } from '../../../../Core/Environments/environment';

interface KnowledgeBaseResponse {
  status: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class Base {
  // private baseUrl = 'https://vashti-unseethed-adjectively.ngrok-free.app/admin/kb';
private baseUrl = `${environment.PREVIEW_BASE_URL}/admin/kb`;

  constructor(private http: HttpClient) {}

  resetKnowledgeBase(): Observable<KnowledgeBaseResponse> {
   

    console.log('🗑️ Resetting knowledge base...');

    return this.http.delete<KnowledgeBaseResponse>(`${this.baseUrl}/reset`).pipe(
      tap(response => console.log('✅ Reset successful:', response)),
      catchError(error => {
        console.error('❌ Reset error:', error);
        throw error;
      })
    );
  }

  /**
   * Upload and Ingest files to Knowledge Base
   * POST endpoint to upload files and rebuild the knowledge base
   */
  uploadAndIngest(formData: FormData): Observable<KnowledgeBaseResponse> {
    

    console.log('📤 Uploading and ingesting files...');

    return this.http.post<KnowledgeBaseResponse>(`${this.baseUrl}/ingest`, formData).pipe(
      tap(response => console.log('✅ Upload successful:', response)),
      catchError(error => {
        console.error('❌ Upload error:', error);
        throw error;
      })
    );
  }
}   