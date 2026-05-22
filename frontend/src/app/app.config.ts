import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';

import { routes } from './app.routes';
import { firebaseConfig } from './firebase.config';

import { LOCALE_ID } from '@angular/core';
import {provideAnimations} from '@angular/platform-browser/animations';
import {provideToastr} from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    {
      provide:
        LOCALE_ID,

      useValue:
        'es-CO'
    },
    provideAnimations(),

provideToastr({

  timeOut: 3000,

  positionClass:
    'toast-bottom-right',

  preventDuplicates:
    true
}),

    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
  ],
};