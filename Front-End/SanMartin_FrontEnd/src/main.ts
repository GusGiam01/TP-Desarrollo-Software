import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { SMHeaderComponent } from './app/sm-header/sm-header.component.js';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
