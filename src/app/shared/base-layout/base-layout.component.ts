import { Component } from '@angular/core';

@Component({
  selector: 'app-base-layout',
  template: `
    <div class="base-layout">
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .base-layout {
      min-height: 100vh;
      width: 100%;
    }
  `]
})
export class BaseLayoutComponent {} 