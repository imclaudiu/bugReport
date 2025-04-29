import { Component } from '@angular/core';
import { BugListComponent } from '../../components/bug-list/bug-list.component';

@Component({
  selector: 'app-bug-list-page',
  template: '<app-bug-list></app-bug-list>',
  standalone: true,
  imports: [BugListComponent]
})
export class BugListPageComponent { } 