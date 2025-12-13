import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Nav } from '../../../Navbar/Pages/nav/nav';
import { CommonModule } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dash',
  imports: [Nav,CommonModule],
  templateUrl: './dash.html',
  styleUrl: './dash.scss',
})
export class Dash implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['sNo', 'testId', 'testname', 'description', 'creationdate', 'duedate', 'testlink'];
  // dataSource: MatTableDataSource<TestHistory>;
  
  searchText: string = '';
  selectedDescription: string = '';
  selectedTestId: string = '';
  selectedDueDate:any=null; 
  selectedRow: number | null = null;
  selectedCreationDate: any=null;


//  @ViewChild(MatPaginator) paginator!: MatPaginator;



  constructor(private router: Router,private snackBar: MatSnackBar,private http:HttpClient) {
    // this.dataSource = new MatTableDataSource<TestHistory>([]);
  }

  ngOnInit(): void {
    // this.loadTestHistory();
  }


ngAfterViewInit() {
  // if (this.paginator) {
    // this.paginator.pageSize = 10;  
    // this.dataSource.paginator = this.paginator;
  }
}



//   loadTestHistory(): void {


//   this.testSer.getAllTests().subscribe({
//   next: (response: any) => {
//     const tests = Array.isArray(response) ? response : response.data || [];
//     // You can now use 'tests' here


//  const sortedTests = this.sortTestsByCreationDate(tests);

//       this.dataSource.data = sortedTests.map((item: any, index: number) => ({
//         sNo: index + 1,
//         testId: String(item.t_id || ''),
//         testname: item.test_name || '',
//         description: item.description || 'N/A',
//         creationdate: item.creattion_date ? new Date(item.creattion_date).toLocaleDateString() : '',
//         duedate: item.due_date ? new Date(item.due_date).toLocaleDateString() : '',
//         testlink: item.test_url || 'N/A'
//       }));
//   }
// });
//   }

//   private sortTestsByCreationDate(tests: any[]): any[] {
//   return [...tests].sort((a, b) => {
//     const dateA = new Date(a.creattion_date).getTime(); // Use actual field name
//     const dateB = new Date(b.creattion_date).getTime();
//     return dateB - dateA; // Descending order
//   });
// }

  
  // this.http.get<any>(apiUrl).subscribe({
  //   next: (response: any) => {
  //     const tests = Array.isArray(response) ? response : response.data || [];
      
  //     this.dataSource.data = tests.map((item: any, index: number) => ({
  //       sNo: index + 1,
  //       testId: String(item.t_id || ''),
  //       testname: item.test_name || '',
  //       description: item.description || 'N/A',
  //       creationdate: item.creattion_date ? new Date(item.creattion_date).toLocaleDateString() : '',
  //       duedate: item.due_date ? new Date(item.due_date).toLocaleDateString() : '',
  //       testlink: item.test_url || 'N/A'
  //     }));
  //   },
  //   error: () => {
  //     this.snackBar.open('Failed to load test history', 'Close', { duration: 3000 });
  //   }
  // });








// createNewTest(): void {
//     console.log('Create new test clicked');
//     this.router.navigate(['/test']);
//     // Implement navigation or modal logic here
//   }

//   clearFilters(): void {
//     this.searchText = '';
//     this.selectedDescription = '';
//     this.selectedTestId = '';
//     this.selectedCreationDate = null;
//     this.selectedDueDate = null;
//     this.applyFilter();
//   }

//   applyFilter(): void {
//     this.dataSource.filterPredicate = (data: TestHistory, filter: string) => {
//       const searchStr = this.searchText.toLowerCase();
//       const matchesSearch = !this.searchText || 
//         data.testId.toLowerCase().includes(searchStr) ||
//         data.testname.toLowerCase().includes(searchStr) ||
//         data.description.toLowerCase().includes(searchStr);
      
//       const matchesDescription = !this.selectedDescription || 
//         data.description === this.selectedDescription;
      
//       const matchesTestId = !this.selectedTestId || 
//         data.testId === this.selectedTestId;
      
//       // const matchesDate = !this.selectedDate || 
//       //   data.creationdate === this.selectedDate ||
//       //   data.duedate === this.selectedDate;
      
//  const matchesCreationDate = !this.selectedCreationDate || 
//       data.creationdate === new Date(this.selectedCreationDate).toLocaleDateString('en-US');
    
//     // Filter by due date
//     const matchesDueDate = !this.selectedDueDate || 
//       data.duedate === new Date(this.selectedDueDate).toLocaleDateString('en-US');


//       return matchesSearch && matchesDescription && matchesTestId && matchesCreationDate && matchesDueDate;
//     };
    
//     this.dataSource.filter = Math.random().toString();
//     if (this.dataSource.paginator) {
//       this.dataSource.paginator.firstPage();
//     }
//   }



//   onRowClick(row: TestHistory): void {
//   this.selectedRow = row.sNo;
//   console.log('Row clicked:', row);
  
//   // Pass test data as navigation state
//   this.router.navigate(['/candidate',row.testId], {
//     state: {
//       testId: row.testId,
//       testName: row.testname,
//       description: row.description,
//       creationDate: row.creationdate,
//       dueDate: row.duedate,
//       testLink: row.testlink
//     }
//   });
// }

//   getRowClass(row: TestHistory): string {
//     return this.selectedRow === row.sNo ? 'selected-row' : '';
//   }



// copyTestLink(link: string, event: Event): void {
//     event.stopPropagation(); // Prevent row click when copying
//     navigator.clipboard.writeText(link).then(() => {
//       this.snackBar.open('Test link copied to clipboard!', 'Close', {
//         duration: 3000,
//         horizontalPosition: 'center',
//         verticalPosition: 'bottom'
//       });
//     }).catch(err => {
//       console.error('Failed to copy link:', err);
//       this.snackBar.open('Failed to copy link', 'Close', {
//         duration: 3000,
//         horizontalPosition: 'center',
//         verticalPosition: 'bottom'
//       });
//     });
//   }

// }
// }
