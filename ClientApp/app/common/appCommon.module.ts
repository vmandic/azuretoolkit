import { AzureToolkitService } from './services/azureToolkit.service';
import { UserService } from './services/userService';
import { NgModule } from '@angular/core';
import { CognitiveService } from './services/cognitive.service';
import { AzureHttpClient } from './services/azureHttpClient';

@NgModule({
    providers: [CognitiveService, AzureHttpClient, UserService, AzureToolkitService],
})
export class AppCommonModule { }
