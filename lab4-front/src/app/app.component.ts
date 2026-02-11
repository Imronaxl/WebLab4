import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <router-outlet></router-outlet>
    <p-toast position="top-right"></p-toast>
  `,
  styles: []
})
export class AppComponent {}
