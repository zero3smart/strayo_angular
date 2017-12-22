import { Apollo } from 'angular-apollo';

import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  constructor(apollo: Apollo) {
    apollo.query({
      query: gql`{ allSites }`
    }).then(console.log);
  }
}
