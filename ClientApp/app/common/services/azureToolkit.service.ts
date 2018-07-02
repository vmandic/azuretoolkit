import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { SavedImage } from '../models/savedImage';

@Injectable()
export class AzureToolkitService {
    private baseUrl: string;

    constructor(private http: Http, @Inject('BASE_URL') baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    public saveImage(imagePostRequest: { url: string, id: string, encodingFormat: string }): Observable<boolean> {
        return this.http.post(`${this.baseUrl}api/images`, imagePostRequest)
            .map(response => {
                return response.ok;
            }).catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

    public getImages(userId: string): Observable<SavedImage[]> {
        return this.http.get(`${this.baseUrl}api/images/${userId}`)
            .map(images => {
                return images.json() as SavedImage[];
            }).catch(this.handleError);
    }
}