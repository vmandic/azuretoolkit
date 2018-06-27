import { BingSearchResponse } from './../models/bingSearchResponse';
import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Observable } from 'rxjs/observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { AzureHttpClient } from './azureHttpClient';

@Injectable()
export class CognitiveService {

    private static BingSearchApiKey = "f62a05bea79d4318b2801d8446c64f01";

    constructor(private http: AzureHttpClient) { }

    searchImages(searchTerm: string): Observable<BingSearchResponse> {
        return this.http
            .get('https://api.cognitive.microsoft.com/bing/v7.0/images/search?q=' + searchTerm, CognitiveService.BingSearchApiKey).map(response => response.json() as BingSearchResponse)
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

}