
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Conversation {
  role: string;
  content: string;
}

export interface UnresolvedQuery {
  conversation: Conversation[];
}

export interface DailyStatistics {
  id: number;
  date: string;
  department: string;
  total_questions: number;
  successful_resolves: number;
  unresolved_queries: UnresolvedQuery[];
}

export interface DailyStatsTableData {
  sNo: number;
  date: string;
  department: string;
  totalQuestions: number;
  successfulResolves: number;
  unresolvedQueries: number;
}

@Injectable({
  providedIn: 'root'
})
export class DailyStats {
  private apiUrl = 'https://vashti-unseethed-adjectively.ngrok-free.app/admin/stats';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'ngrok-skip-browser-warning': 'true'  // Required for ngrok
    });
  }

  getDailyStatistics(
    department?: string,
    startDate?: string,
    endDate?: string
  ): Observable<DailyStatsTableData[]> {
    let params = new HttpParams();

    if (department) {
      params = params.set('department', department);
    }
    if (startDate) {
      params = params.set('start_date', startDate);
    }
    if (endDate) {
      params = params.set('end_date', endDate);
    }

    const headers = this.getHeaders();

    return this.http.get<DailyStatistics[]>(this.apiUrl, { 
      params, 
      headers 
    }).pipe(
      map((data: DailyStatistics[]) => 
        data.map((item, index) => ({
          sNo: index + 1,
          date: item.date,
          department: item.department,
          totalQuestions: item.total_questions,
          successfulResolves: item.successful_resolves,
          unresolvedQueries: item.unresolved_queries?.length || 0
        }))
      )
    );
  }

  // Get all departments for filter dropdown
  getAllDepartments(): Observable<string[]> {
    const headers = this.getHeaders();

    return this.http.get<DailyStatistics[]>(this.apiUrl, { headers }).pipe(
      map((data: DailyStatistics[]) => {
        const departments = new Set(data.map(item => item.department));
        return Array.from(departments).sort();
      })
    );
  }
}