import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
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
  imports: [CommonModule, materialmodule, FormsModule, Nav],
  templateUrl: './stats.html',
  styleUrl: './stats.scss',
})
// export class Stats implements OnInit {
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

//   dataSource: MatTableDataSource<DailyStatistics>;
//   isLoading: boolean = false;

//   // Filter properties
//   selectedStartDate: any = null;
//   selectedEndDate: any = null;
//   selectedDepartment: string = '';
//   departments: string[] = [];

//   @ViewChild(MatPaginator) paginator!: MatPaginator;

//   constructor(
//     private router: Router,
//     private snackBar: MatSnackBar,
//     private dailyStatsService: DailyStats
//   ) {
//     this.dataSource = new MatTableDataSource<DailyStatistics>([]);
//   }

//   ngOnInit(): void {
//     this.loadDailyStats();
//   }

//   ngAfterViewInit(): void {
//     this.dataSource.paginator = this.paginator;
//   }

//   loadDailyStats(): void {
//     this.isLoading = true;
//     this.dailyStatsService.getDailyStatistics().subscribe({
//       next: (data: DailyStatistics[]) => {
//         this.dataSource.data = data;
//         this.calculateCardStats(data);
//         this.extractDepartments(data);
//         this.isLoading = false;

//         if (this.paginator) {
//           this.dataSource.paginator = this.paginator;
//         }

//         this.applyFilter();
//       },
//       error: (error: any) => {
//         console.error('Error loading daily statistics:', error);
//         this.snackBar.open('Error loading data', 'Close', { duration: 3000 });
//         this.isLoading = false;
//       }
//     });
//   }

//   calculateCardStats(data: DailyStatistics[]): void {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     const todayData = data.filter(item => {
//       const itemDate = new Date(item.date);
//       itemDate.setHours(0, 0, 0, 0);
//       return itemDate.getTime() === today.getTime();
//     });

//     this.totalQuestionsToday = todayData.reduce((sum, item) => sum + item.totalQuestions, 0);
//     this.successfulResolvesToday = todayData.reduce((sum, item) => sum + item.successfulResolves, 0);
//     this.unresolvedToday = todayData.reduce((sum, item) => sum + item.unresolvedQueries, 0);
//   }

//   extractDepartments(data: DailyStatistics[]): void {
//     const uniqueDepts = new Set(data.map(item => item.department));
//     this.departments = Array.from(uniqueDepts).sort();
//   }

//   applyFilter(): void {
//     this.dataSource.filterPredicate = (data: DailyStatistics, filter: string) => {
//       const matchesDepartment = !this.selectedDepartment ||
//         data.department === this.selectedDepartment;

//       const matchesDateRange = this.isDateInRange(
//         data.date,
//         this.selectedStartDate,
//         this.selectedEndDate
//       );

//       return matchesDepartment && matchesDateRange;
//     };

//     this.dataSource.filter = Math.random().toString();
//     if (this.dataSource.paginator) {
//       this.dataSource.paginator.firstPage();
//     }
//   }

//   private isDateInRange(dateStr: string, startDate: any, endDate: any): boolean {
//     if (!startDate && !endDate) return true;
//     if (!dateStr) return false;

//     try {
//       const dateObj = new Date(dateStr);
//       dateObj.setHours(0, 0, 0, 0);

//       if (startDate && !endDate) {
//         const startDateObj = new Date(startDate);
//         startDateObj.setHours(0, 0, 0, 0);
//         return dateObj >= startDateObj;
//       }

//       if (!startDate && endDate) {
//         const endDateObj = new Date(endDate);
//         endDateObj.setHours(0, 0, 0, 0);
//         return dateObj <= endDateObj;
//       }

//       if (startDate && endDate) {
//         const startDateObj = new Date(startDate);
//         const endDateObj = new Date(endDate);
//         startDateObj.setHours(0, 0, 0, 0);
//         endDateObj.setHours(0, 0, 0, 0);
//         return dateObj >= startDateObj && dateObj <= endDateObj;
//       }

//       return false;
//     } catch (error) {
//       console.error('Error comparing dates:', error);
//       return false;
//     }
//   }

//   calculatePercentage(value: number, total: number): string {
//   if (total === 0) return '0%';
//   const percentage = (value / total) * 100;
//   return `${percentage.toFixed(0)}%`;
// }

//   clearFilters(): void {
//     this.selectedStartDate = null;
//     this.selectedEndDate = null;
//     this.selectedDepartment = '';
//     this.applyFilter();
//   }

//   navigateToUpload(): void {
//     this.router.navigate(['/upload-document']);
//   }

//   navigateToKnowledgeBase(): void {
//     this.router.navigate(['/knowledge-base']);
//   }

//   navigateToStats(): void {
//     this.router.navigate(['/daily-stats']);
//   }
// }



export class Stats implements OnInit, AfterViewInit {
  // Card Statistics
  totalQuestionsToday: number = 0;
  successfulResolvesToday: number = 0;
  unresolvedToday: number = 0;

  // Table Configuration
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

  // Filter properties
  selectedStartDate: Date | null = null;
  selectedEndDate: Date | null = null;
  selectedDepartment: string = '';
  departments: string[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private dailyStatsService: DailyStats
  ) {
    this.dataSource = new MatTableDataSource<DailyStatsTableData>([]);
  }

  ngOnInit(): void {
    this.loadDepartments();
    this.loadDailyStats();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  loadDepartments(): void {
    this.dailyStatsService.getAllDepartments().subscribe({
      next: (departments: string[]) => {
        this.departments = departments;
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

    this.dailyStatsService.getDailyStatistics(
      this.selectedDepartment || undefined,
      startDate,
      endDate
    ).subscribe({
      next: (data: DailyStatsTableData[]) => {
        this.dataSource.data = data;
        this.calculateCardStats(data);
        this.isLoading = false;

        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
        }
      },
      error: (error: any) => {
        console.error('Error loading daily statistics:', error);
        this.snackBar.open('Error loading data', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  calculateCardStats(data: DailyStatsTableData[]): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = this.formatDate(today);

    const todayData = data.filter(item => item.date === todayStr);

    this.totalQuestionsToday = todayData.reduce(
      (sum, item) => sum + item.totalQuestions, 0
    );
    this.successfulResolvesToday = todayData.reduce(
      (sum, item) => sum + item.successfulResolves, 0
    );
    this.unresolvedToday = todayData.reduce(
      (sum, item) => sum + item.unresolvedQueries, 0
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

  clearFilters(): void {
    this.selectedStartDate = null;
    this.selectedEndDate = null;
    this.selectedDepartment = '';
    this.loadDailyStats();
  }

  calculatePercentage(value: number, total: number): string {
    if (total === 0) return '0%';
    const percentage = (value / total) * 100;
    return `${percentage.toFixed(0)}%`;
  }

  navigateToUpload(): void {
    this.router.navigate(['/upload-document']);
  }

  navigateToKnowledgeBase(): void {
    this.router.navigate(['/knowledge-base']);
  }

  navigateToStats(): void {
    this.router.navigate(['/daily-stats']);
  }
}