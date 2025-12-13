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
//   // Card Statistics
//   totalQuestionsToday: number = 0;
//   successfulResolvesToday: number = 0;
//   unresolvedToday: number = 0;

//   // Table Configuration
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

//   // Filter properties
//   selectedStartDate: Date | null = null;
//   selectedEndDate: Date | null = null;
//   selectedDepartment: string = '';
//   departments: string[] = [];

//   @ViewChild(MatPaginator) paginator!: MatPaginator;

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

//   loadDepartments(): void {
//     this.dailyStatsService.getAllDepartments().subscribe({
//       next: (departments: string[]) => {
//         this.departments = departments;
//       },
//       error: (error: any) => {
//         console.error('Error loading departments:', error);
//       }
//     });
//   }

//   loadDailyStats(): void {
//     this.isLoading = true;

//     const startDate = this.selectedStartDate 
//       ? this.formatDate(this.selectedStartDate) 
//       : undefined;
//     const endDate = this.selectedEndDate 
//       ? this.formatDate(this.selectedEndDate) 
//       : undefined;

//     this.dailyStatsService.getDailyStatistics(
//       this.selectedDepartment || undefined,
//       startDate,
//       endDate
//     ).subscribe({
//       next: (data: DailyStatsTableData[]) => {
//         this.dataSource.data = data;
//         this.calculateCardStats(data);
//         this.isLoading = false;

//         if (this.paginator) {
//           this.dataSource.paginator = this.paginator;
//           this.paginator.pageIndex = 0;
//           this.cdr.detectChanges();
//         }
//       },
//       error: (error: any) => {
//         console.error('Error loading daily statistics:', error);
//         this.snackBar.open('Error loading data', 'Close', { duration: 3000 });
//         this.isLoading = false;
//       }
//     });
//   }

//   calculateCardStats(data: DailyStatsTableData[]): void {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     const todayStr = this.formatDate(today);

//     const todayData = data.filter(item => item.date === todayStr);

//     this.totalQuestionsToday = todayData.reduce(
//       (sum, item) => sum + item.totalQuestions, 0
//     );
//     this.successfulResolvesToday = todayData.reduce(
//       (sum, item) => sum + item.successfulResolves, 0
//     );
//     this.unresolvedToday = todayData.reduce(
//       (sum, item) => sum + item.unresolvedQueries, 0
//     );
//   }

//   formatDate(date: Date): string {
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const day = String(date.getDate()).padStart(2, '0');
//     return `${year}-${month}-${day}`;
//   }

//   applyFilter(): void {
//     this.loadDailyStats();
//   }

//   clearFilters(): void {
//     this.selectedStartDate = null;
//     this.selectedEndDate = null;
//     this.selectedDepartment = '';
//     this.loadDailyStats();
//   }

//   calculatePercentage(value: number, total: number): string {
//     if (total === 0) return '0%';
//     const percentage = (value / total) * 100;
//     return `${percentage.toFixed(0)}%`;
//   }

//   navigateToUpload(): void {
//     this.router.navigate(['/upload']);
//   }

//   navigateToKnowledgeBase(): void {
//     this.router.navigate(['/knowledge']);
//   }

//   navigateToStats(): void {
//     this.router.navigate(['/stats']);
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
    this.dailyStatsService.getAllDepartments().subscribe({
      next: (departments: string[]) => {
        this.departments = departments;
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error('Error loading departments:', error);
      }
    });
  }

  loadDailyStats(): void {
    this.isLoading = true;

    const startDate = this.selectedStartDate 
      ? this.formatDate(this.selectedStartDate) 
      : undefined;
    const endDate = this.selectedEndDate 
      ? this.formatDate(this.selectedEndDate) 
      : undefined;

    this.dailyStatsService.getDailyStatisticsRaw(
      this.selectedDepartment || undefined,
      startDate,
      endDate
    ).subscribe({
      next: (data: any[]) => {
        this.fullStatsData = data;

        const tableData = data.map((item, index) => ({
          sNo: index + 1,
          date: item.date,
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
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = this.formatDate(today);

    const todayData = data.filter(item => item.date === todayStr);

    this.totalQuestionsToday = todayData.reduce(
      (sum, item) => sum + item.total_questions, 0
    );
    this.successfulResolvesToday = todayData.reduce(
      (sum, item) => sum + item.successful_resolves, 0
    );
    this.unresolvedToday = todayData.reduce(
      (sum, item) => sum + (item.unresolved_queries?.length || 0), 0
    );
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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
    const fullData = this.fullStatsData.find(item => 
      item.date === row.date && item.department === row.department
    );

    if (fullData && fullData.unresolved_queries && fullData.unresolved_queries.length > 0) {
      localStorage.setItem('selectedConversations', JSON.stringify(fullData.unresolved_queries));
      localStorage.setItem('selectedRowInfo', JSON.stringify({
        date: row.date,
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