import { ComputerVisionRequest, ComputerVisionResponse } from './../models/computerVisionResponse';
import { BingSearchResponse } from './../models/bingSearchResponse';
import './../models/computerVisionResponse';
import { AzureHttpClient } from './azureHttpClient';

import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Observable } from 'rxjs/observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class CognitiveService {

    private static ComputerVisionAK = "9e2b02845f8840908405497f819c2ff8";
    private static BingSearchAK = "f62a05bea79d4318b2801d8446c64f01";

    constructor(private http: AzureHttpClient) { }

    public searchImages(searchTerm: string): Observable<BingSearchResponse> {
        return this.http
            .get(`https://api.cognitive.microsoft.com/bing/v7.0/images/search?q=${searchTerm}`, CognitiveService.BingSearchAK).map(response => response.json() as BingSearchResponse)
            .catch(this.handleError);
    }

    public analyzeImage(request: ComputerVisionRequest): Observable<ComputerVisionResponse> {
        return this.http.post('https://northeurope.api.cognitive.microsoft.com/vision/v1.0/analyze?visualFeatures=Description,Tags', CognitiveService.ComputerVisionAK, request)
            .map(resp => resp.json() as ComputerVisionResponse)
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}