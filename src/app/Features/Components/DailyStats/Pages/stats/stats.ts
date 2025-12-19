import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { DailyStats, DailyStatsTableData } from '../../Services/daily-stats';
import { materialmodule } from '../../../../../Shared/Modules/materialmodule';
import { Nav } from '../../../Navbar/Pages/nav/nav';

interface DailyStatistics {
  sNo: number;
  date: string;
  department: string;
  totalQuestions: number;
  successfulResolves: number;
  unresolvedQueries: number;
}


@Component({
  selector: 'app-stats',
  imports: [CommonModule, materialmodule, FormsModule, Nav,RouterModule],
  templateUrl: './stats.html',
  styleUrl: './stats.scss',
})




// export class Stats implements OnInit, AfterViewInit {
//   totalQuestionsToday: number = 0;
//   successfulResolvesToday: number = 0;
//   unresolvedToday: number = 0;

//   displayedColumns: string[] = [
//     'sNo',
//     'date',
//     'department',
//     'totalQuestions',
//     'successfulResolves',
//     'unresolvedQueries'
//   ];

//   dataSource: MatTableDataSource<DailyStatsTableData>;
//   isLoading: boolean = false;

//   selectedStartDate: Date | null = null;
//   selectedEndDate: Date | null = null;
//   selectedDepartment: string = '';
//   departments: string[] = [];

//   private fullStatsData: any[] = [];

//   @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

//   constructor(
//     private router: Router,
//     private snackBar: MatSnackBar,
//     private dailyStatsService: DailyStats,
//     private cdr: ChangeDetectorRef
//   ) {
//     this.dataSource = new MatTableDataSource<DailyStatsTableData>([]);
//   }

//   ngOnInit(): void {
//     this.loadDepartments();
//     this.loadDailyStats();
//   }

//   ngAfterViewInit(): void {
//     this.dataSource.paginator = this.paginator;
//     this.cdr.detectChanges();
//   }

//   // loadDepartments(): void {
//   //   this.dailyStatsService.getAllDepartments().subscribe({
//   //     next: (departments: string[]) => {
//   //       this.departments = departments;
//   //       this.cdr.detectChanges();
//   //     },
//   //     error: (error: any) => {
//   //       console.error('Error loading departments:', error);
//   //     }
//   //   });
//   // }

//   loadDepartments(): void {
//   // Set predefined departments instead of loading from service
//   this.departments = ['HR', 'Finance', 'Facilities', 'IT'];
//   this.cdr.detectChanges();
// }

//   loadDailyStats(): void {
//     this.isLoading = true;

//     const startDate = this.selectedStartDate 
//       ? this.formatDate(this.selectedStartDate) 
//       : undefined;
//     const endDate = this.selectedEndDate 
//       ? this.formatDate(this.selectedEndDate) 
//       : undefined;

//     this.dailyStatsService.getDailyStatisticsRaw(
//       this.selectedDepartment || undefined,
//       startDate,
//       endDate
//     ).subscribe({
//       next: (data: any[]) => {
//         this.fullStatsData = data;

//         const tableData = data.map((item, index) => ({
//           sNo: index + 1,
//           date: item.date,
//           department: item.department,
//           totalQuestions: item.total_questions,
//           successfulResolves: item.successful_resolves,
//           unresolvedQueries: item.unresolved_queries?.length || 0,
//           id: item.id
//         }));

//         this.dataSource.data = tableData;
//         this.calculateCardStats(data);
//         this.isLoading = false;

//         this.cdr.detectChanges();
        
//         if (this.paginator) {
//           this.dataSource.paginator = this.paginator;
//           this.paginator.firstPage();
//         }
//       },
//       error: (error: any) => {
//         console.error('Error loading daily statistics:', error);
//         this.snackBar.open('Error loading data', 'Close', { duration: 3000 });
//         this.isLoading = false;
//         this.cdr.detectChanges();
//       }
//     });
//   }

//  calculateCardStats(data: any[]): void {
//   // Calculate totals from ALL data (not filtered by date)
//   this.totalQuestionsToday = data.reduce(
//     (sum, item) => sum + item.total_questions, 0
//   );
//   this.successfulResolvesToday = data.reduce(
//     (sum, item) => sum + item.successful_resolves, 0
//   );
//   this.unresolvedToday = data.reduce(
//     (sum, item) => sum + (item.unresolved_queries?.length || 0), 0
//   );
// }

//   formatDate(date: Date): string {
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const day = String(date.getDate()).padStart(2, '0');
//     return `${year}-${month}-${day}`;
//   }

//   applyFilter(): void {
//     this.loadDailyStats();
//   }

//   calculatePercentage(value: number, total: number): string {
//     if (total === 0) return '0%';
//     const percentage = (value / total) * 100;
//     return `${percentage.toFixed(0)}%`;
//   }

//   onRowClick(row: any): void {
//     const fullData = this.fullStatsData.find(item => 
//       item.date === row.date && item.department === row.department
//     );

//     if (fullData && fullData.unresolved_queries && fullData.unresolved_queries.length > 0) {
//       localStorage.setItem('selectedConversations', JSON.stringify(fullData.unresolved_queries));
//       localStorage.setItem('selectedRowInfo', JSON.stringify({
//         date: row.date,
//         department: row.department,
//         totalQuestions: row.totalQuestions,
//         successfulResolves: row.successfulResolves,
//         unresolvedQueries: row.unresolvedQueries
//       }));

//       this.router.navigate(['/conversation']);
//     } else {
//       this.snackBar.open('No unresolved queries for this record', 'Close', { duration: 2000 });
//     }
//   }
// }



export class Stats implements OnInit, AfterViewInit {
  totalQuestionsToday: number = 0;
  successfulResolvesToday: number = 0;
  unresolvedToday: number = 0;

  displayedColumns: string[] = [
    'sNo',
    'date',
    'department',
    'totalQuestions',
    'successfulResolves',
    'unresolvedQueries'
  ];

  dataSource: MatTableDataSource<DailyStatsTableData>;
  isLoading: boolean = false;

  selectedStartDate: Date | null = null;
  selectedEndDate: Date | null = null;
  selectedDepartment: string = '';
  departments: string[] = [];

  private fullStatsData: any[] = [];

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private dailyStatsService: DailyStats,
    private cdr: ChangeDetectorRef
  ) {
    this.dataSource = new MatTableDataSource<DailyStatsTableData>([]);
  }

  ngOnInit(): void {
    this.loadDepartments();
    this.loadDailyStats();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.cdr.detectChanges();
  }

  loadDepartments(): void {
    // Set predefined departments instead of loading from service
    this.departments = ['HR', 'Finance', 'Facilities', 'IT'];
    this.cdr.detectChanges();
  }

  loadDailyStats(): void {
    this.isLoading = true;

    const startDate = this.selectedStartDate 
      ? this.formatDateForAPI(this.selectedStartDate) 
      : undefined;
    const endDate = this.selectedEndDate 
      ? this.formatDateForAPI(this.selectedEndDate) 
      : undefined;

    this.dailyStatsService.getDailyStatisticsRaw(
      this.selectedDepartment || undefined,
      startDate,
      endDate
    ).subscribe({
      next: (data: any[]) => {
        this.fullStatsData = data;

        // Sort data by date in descending order (most recent first)
        const sortedData = [...data].sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateB.getTime() - dateA.getTime();
        });

        const tableData = sortedData.map((item, index) => ({
          sNo: index + 1,
          date: this.formatDateForDisplay(item.date),
          originalDate: item.date, // Keep original date for filtering
          department: item.department,
          totalQuestions: item.total_questions,
          successfulResolves: item.successful_resolves,
          unresolvedQueries: item.unresolved_queries?.length || 0,
          id: item.id
        }));

        this.dataSource.data = tableData;
        this.calculateCardStats(data);
        this.isLoading = false;

        this.cdr.detectChanges();
        
        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
          this.paginator.firstPage();
        }
      },
      error: (error: any) => {
        console.error('Error loading daily statistics:', error);
        this.snackBar.open('Error loading data', 'Close', { duration: 3000 });
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  calculateCardStats(data: any[]): void {
    // Calculate totals from ALL data (not filtered by date)
    this.totalQuestionsToday = data.reduce(
      (sum, item) => sum + item.total_questions, 0
    );
    this.successfulResolvesToday = data.reduce(
      (sum, item) => sum + item.successful_resolves, 0
    );
    this.unresolvedToday = data.reduce(
      (sum, item) => sum + (item.unresolved_queries?.length || 0), 0
    );
  }

  // Format date for API calls (yyyy-mm-dd)
  formatDateForAPI(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Format date for display (dd-mm-yyyy)
  formatDateForDisplay(dateString: string): string {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  applyFilter(): void {
    this.loadDailyStats();
  }

  calculatePercentage(value: number, total: number): string {
    if (total === 0) return '0%';
    const percentage = (value / total) * 100;
    return `${percentage.toFixed(0)}%`;
  }

  onRowClick(row: any): void {
    // Use originalDate for finding the data
    const fullData = this.fullStatsData.find(item => 
      item.date === row.originalDate && item.department === row.department
    );

    if (fullData && fullData.unresolved_queries && fullData.unresolved_queries.length > 0) {
      localStorage.setItem('selectedConversations', JSON.stringify(fullData.unresolved_queries));
      localStorage.setItem('selectedRowInfo', JSON.stringify({
        date: row.date, // This is already formatted
        department: row.department,
        totalQuestions: row.totalQuestions,
        successfulResolves: row.successfulResolves,
        unresolvedQueries: row.unresolvedQueries
      }));

      this.router.navigate(['/conversation']);
    } else {
      this.snackBar.open('No unresolved queries for this record', 'Close', { duration: 2000 });
    }
  }
}