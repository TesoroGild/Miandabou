import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { environment } from './environments/dev.environment';

const apiKey = environment.google_api_key;

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
