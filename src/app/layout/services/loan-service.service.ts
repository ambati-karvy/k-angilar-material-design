import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoanServiceService {

  currentNameSubject$ = new BehaviorSubject('Eric');
  constructor() { }
}
