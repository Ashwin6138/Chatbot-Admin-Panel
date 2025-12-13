// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root',
// })
// export class Base {
  
// }



import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, tap } from 'rxjs';

interface KnowledgeBaseResponse {
  status: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class Base {
  private baseUrl = 'https://vashti-unseethed-adjectively.ngrok-free.app/admin/kb';

  constructor(private http: HttpClient) {}

  /**
   * Reset the Knowledge Base
   * DELETE endpoint to reset the knowledge base
   */
  resetKnowledgeBase(): Observable<KnowledgeBaseResponse> {
    const headers = new HttpHeaders({
      'ngrok-skip-browser-warning': 'true'
    });

    console.log('🗑️ Resetting knowledge base...');

    return this.http.delete<KnowledgeBaseResponse>(`${this.baseUrl}/reset`, { headers }).pipe(
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
    const headers = new HttpHeaders({
      'ngrok-skip-browser-warning': 'true'
    });

    console.log('📤 Uploading and ingesting files...');

    return this.http.post<KnowledgeBaseResponse>(`${this.baseUrl}/ingest`, formData, { headers }).pipe(
      tap(response => console.log('✅ Upload successful:', response)),
      catchError(error => {
        console.error('❌ Upload error:', error);
        throw error;
      })
    );
  }
}   