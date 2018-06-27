import { ComputerVisionResponse, ComputerVisionRequest } from './../../common/models/computerVisionResponse';
import { Component } from '@angular/core';

import { CognitiveService } from '../../common/services/cognitive.service';
import { ImageResult } from '../../common/models/bingSearchResponse';
import '../../common/models/computerVisionResponse';

@Component({
    selector: "search",
    templateUrl: "./search.component.html",
    styleUrls: ["./search.component.css"]
})
export class SearchComponent {

    public searchResults: ImageResult[] | null = null;
    currentAnalytics: ComputerVisionResponse | null = null;
    currentItem: ImageResult | null = null;
    isAnalyzing = false;
    isSearching = false;

    constructor(private cognitiveService: CognitiveService) { };

    public search(searchTerm: string) {
        this.searchResults = null;
        this.isSearching = true;
        this.currentAnalytics = null;
        this.cognitiveService
            .searchImages(searchTerm)
            .subscribe(result => {
                this.searchResults = result.value;
                this.isSearching = false;
            });
    }

    public analyze(result: ImageResult) {
        this.currentItem = result;
        this.currentAnalytics = null;
        this.isAnalyzing = true;
        this.cognitiveService
            .analyzeImage({ url: result.thumbnailUrl })
            .subscribe(result => {
                this.currentAnalytics = result;
                this.isAnalyzing = false;
            });

        window.scroll(0, 0);
    }
}
