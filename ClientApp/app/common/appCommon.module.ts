import { UserService } from './services/userService';
import { NgModule } from '@angular/core';
import { CognitiveService } from './services/cognitive.service';
import { AzureHttpClient } from './services/azureHttpClient';

@NgModule({
    providers: [CognitiveService, AzureHttpClient, UserService],
})
export class AppCommonModule { }
