import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { interval, Observable, of  } from 'rxjs';
import 'rxjs/Rx';
import { HttpClient } from '@angular/common/http';
import { fromWorker } from 'observable-webworker';
import { FileHashEvent, HashWorkerMessage, Thread } from './hash-worker.types';
import { fromWorkerPool } from 'observable-webworker';
import { GoogleChartsService } from './google-charts.service';
import TimelineOptions = google.visualization.TimelineOptions;

import {
  animationFrameScheduler,
  asyncScheduler,
  combineLatest,
  concat,
  ReplaySubject,
  Subject,
} from 'rxjs';
import {
  filter,
  groupBy,
  map,
  mergeMap,
  observeOn,
  scan,
  shareReplay,
  startWith,
  switchMap,
  switchMapTo,
  take,
  takeUntil,
  tap,
} from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  hide = true;
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;

    // const sortState: Sort = {active: 'name', direction: 'desc'};
    // this.sort.active = sortState.active;
    // this.sort.direction = sortState.direction;
    // this.sort.sortChange.emit(sortState);

  }

  public intervallTimer = interval(2000);
  private subscription;
  constructor(private http:HttpClient, private googleChartService: GoogleChartsService) {
    // this.workResult$.subscribe(data => {
    //   console.log(data)
    // })
  }

  public createObs1() {
    this.subscription = this.intervallTimer.switchMap(() => this.http.get('http://jsonplaceholder.typicode.com/users/')).map((data) => data)
    .subscribe((data) => { 
       console.log(data);// see console you get output every 5 sec
    });
  }

  public destory() {
    
    this.subscription.unsubscribe()
  }

  createObs() {
    alert(2)
    const input$: Observable<string> = of('hello');

    fromWorker<string, string>(() => new Worker('./hello.worker', { type: 'module'}), input$)
      .subscribe(message => {
        console.log(`Got message`, message);
      });

  }

  //  -----------------------------------------------------------------

  public multiFilesToHash: Subject<File[]> = new ReplaySubject(1);
  public workResult$ = this.multiFilesToHash.pipe(
    observeOn(asyncScheduler),
    switchMap(files => this.hashMultipleFiles(files)),
  );

  public filenames$ = this.multiFilesToHash.pipe(
    map(files => files.map(f => f.name)),
    shareReplay(1),
  );

  public eventsPool$: Subject<HashWorkerMessage> = new Subject();

  public completedFiles$: Observable<string[]> = this.filenames$.pipe(
    switchMap(() =>
      this.eventsPool$.pipe(
        groupBy(m => m.file),
        mergeMap(fileMessage$ =>
          fileMessage$.pipe(
            filter(e => e.fileEventType === FileHashEvent.HASH_RECEIVED),
            take(1),
          ),
        ),
        map(message => message.file),
        scan<string, string[]>((files, file) => [...files, file], []),
        startWith([]),
      ),
    ),
  );

  // public complete$: Observable<boolean> = combineLatest([this.filenames$, this.completedFiles$]).pipe(
  //   map(([files, completedFiles]) => files.length === completedFiles.length),
  // );

  // public status$: Observable<string> = concat(of(null), this.complete$).pipe(
  //   map(isComplete => {
  //     switch (isComplete) {
  //       case null:
  //         return 'Waiting for file selection';
  //       case true:
  //         return 'Completed';
  //       case false:
  //         return 'Processing files';
  //     }
  //   }),
  // );

  public eventListPool$: Observable<HashWorkerMessage[]> = this.eventsPool$.pipe(
    scan<HashWorkerMessage, HashWorkerMessage[]>((list, event) => {
      list.push(event);
      return list;
    }, []),
    map(events => {
      const lastEventMap = new Map();

      return events
        .sort((a, b) => a.timestamp.valueOf() - b.timestamp.valueOf())
        .map(event => {
          const lastEvent = lastEventMap.get(event.file);

          lastEventMap.set(event.file, event);

          return {
            ...event,
            millisSinceLast: lastEvent ? event.timestamp.valueOf() - lastEvent.timestamp.valueOf() : null,
          };
        });
    }),
  );

  private *workPool(files: File[]): IterableIterator<File> {
    for (const file of files) {
      yield file;
      this.eventsPool$.next(this.logMessage(FileHashEvent.PICKED_UP, `file picked up for processing`, file.name, '20'));
    }
  }

  public hashMultipleFiles(files: File[]): Observable<HashWorkerMessage> {
    const queue: IterableIterator<File> = this.workPool(files);

    return fromWorkerPool<Blob, HashWorkerMessage>(index => {
      const worker = new Worker('./file-hash.worker', { name: `hash-worker-${index}`, type: 'module' });
      this.eventsPool$.next(this.logMessage(null, `worker ${index} created`));
      return worker;
    }, queue).pipe(
      tap(res => {
        this.eventsPool$.next(res);
        if (res.fileEventType === FileHashEvent.HASH_COMPUTED) {
          this.eventsPool$.next({
            ...res,
            fileEventType: FileHashEvent.HASH_RECEIVED,
            timestamp: new Date(),
            message: 'hash received',
            thread: Thread.MAIN,
          });
        }
      }),
    );
  }
  //9999481217
  public calculateMD5Multiple($event): void {
    const files: File[] = Array.from($event.target.files);
    this.multiFilesToHash.next(files);
    for (const file of files) {
      this.eventsPool$.next(this.logMessage(FileHashEvent.SELECTED, 'file selected', file.name, '5'));
    }
  }

  private logMessage(eventType: FileHashEvent | null, message: string, file?: string, percentage?: string): HashWorkerMessage {
    return { message, file, timestamp: new Date(), thread: Thread.MAIN, fileEventType: eventType, percentage };
  }
}

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  // {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  // {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  // {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  // {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  // {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  // {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  // {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  // {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  // {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  // {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
  // {position: 11, name: 'Sodium', weight: 22.9897, symbol: 'Na'},
  // {position: 12, name: 'Magnesium', weight: 24.305, symbol: 'Mg'},
  // {position: 13, name: 'Aluminum', weight: 26.9815, symbol: 'Al'},
  // {position: 14, name: 'Silicon', weight: 28.0855, symbol: 'Si'},
  // {position: 15, name: 'Phosphorus', weight: 30.9738, symbol: 'P'},
  // {position: 16, name: 'Sulfur', weight: 32.065, symbol: 'S'},
  // {position: 17, name: 'Chlorine', weight: 35.453, symbol: 'Cl'},
  // {position: 18, name: 'Argon', weight: 39.948, symbol: 'Ar'},
  // {position: 19, name: 'Potassium', weight: 39.0983, symbol: 'K'},
  // {position: 20, name: 'Calcium', weight: 40.078, symbol: 'Ca'},
];
