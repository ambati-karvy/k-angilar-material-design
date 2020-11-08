import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { HashWorkerMessage } from '../hash-worker.types';

@Component({
  selector: 'app-log-list',
  templateUrl: './log-list.component.html',
  styleUrls: ['./log-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogListComponent implements OnInit {

  @Input() message: HashWorkerMessage;
  @Input() files: string[];

  public color: string;

  constructor() {}

  ngOnInit() {
    this.color = `hsl(${(this.files.indexOf(this.message.file) / this.files.length) * 360}, 70%, 60%)`;
  }

}
