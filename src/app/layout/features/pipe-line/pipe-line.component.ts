import { Component, OnInit, ViewChild, TemplateRef, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ThemePalette } from '@angular/material/core';
import { Router } from '@angular/router';
import { LoanServiceService } from '../../services/loan-service.service';

@Component({
  selector: 'app-pipe-line',
  templateUrl: './pipe-line.component.html',
  styleUrls: ['./pipe-line.component.scss']
})
export class PipeLineComponent implements OnInit,AfterViewInit  {
  @ViewChild('mismoFileUpload') mismoFileUpload: TemplateRef<any>;
  hide = true;
  background: ThemePalette = 'primary';
  links = ['First', 'Second', 'Third'];
  activeLink = this.links[0];
  constructor(public matDialog:MatDialog,private router: Router, private loanReview:LoanServiceService) { }

  ngOnInit(): void {
    
  }

  navifation(): void {
    this.router.navigateByUrl('/loan-review');
    this.loanReview.currentNameSubject$.next('raghu')
  }

  
  ngAfterViewInit() {
    //this.matDialog.open(this.mismoFileUpload,{ disableClose: true });
  }

  files: any[] = [];

  /**
   * on file drop handler
   */
  onFileDropped($event) {
    this.prepareFilesList($event);
  }

  /**
   * handle file from browsing
   */
  fileBrowseHandler(files) {
    this.prepareFilesList(files);
  }

  /**
   * Delete file from files list
   * @param index (File index)
   */
  deleteFile(index: number) {
    this.files.splice(index, 1);
  }

  /**
   * Simulate the upload process
   */
  uploadFilesSimulator(index: number) {
    setTimeout(() => {
      if (index === this.files.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.files[index].progress === 100) {
            clearInterval(progressInterval);
            this.uploadFilesSimulator(index + 1);
          } else {
            this.files[index].progress += 5;
          }
        }, 200);
      }
    }, 1000);
  }

  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.files.push(item);
    }
    this.uploadFilesSimulator(0);
  }

  /**
   * format bytes
   * @param bytes (File size in bytes)
   * @param decimals (Decimals point)
   */
  formatBytes(bytes, decimals) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

}
