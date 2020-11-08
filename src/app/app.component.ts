import { Component, Inject, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  constructor(@Inject(DOCUMENT) private document: Document, private renderer: Renderer2) {}

  switchMode(isDarkMode: boolean) {
    const hostClass = isDarkMode ? 'theme-dark' : 'theme-light';
    this.renderer.setAttribute(this.document.body, 'class', hostClass);
  }

  runWorker() {

    const demoWorker = new Worker('./demo.worker', { type: 'module'});

    demoWorker.onmessage = (message) => {
      console.log(`Got message`, message.data);
    };

    demoWorker.postMessage('hello');

  }
}
