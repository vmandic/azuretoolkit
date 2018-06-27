import { NgModule } from '@angular/core';
import { CognitiveService } from './services/cognitive.service';
import { AzureHttpClient } from './services/azureHttpClient';

@NgModule({
    providers: [CognitiveService, AzureHttpClient],
})
export class AppCommonModule { }
