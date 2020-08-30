import { Component, OnInit } from '@angular/core';
import { LoanServiceService } from '../../services/loan-service.service'

@Component({
  selector: 'app-loan-review',
  templateUrl: './loan-review.component.html',
  styleUrls: ['./loan-review.component.scss']
})
export class LoanReviewComponent implements OnInit {

  loanNumber: string;
  constructor(private loanReview:LoanServiceService) { }

  ngOnInit(): void {
    //alert(this.loanReview.currentNameSubject$.getValue)
    this.loanReview.currentNameSubject$.subscribe(value => {
      alert(value)
      this.loanNumber = value;
    })
    
  }

}
