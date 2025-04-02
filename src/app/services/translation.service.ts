import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  constructor(private http: HttpClient, private translate: TranslateService) {}

  loadTranslationsFromAPI(lang: any) {
    const apiUrl = `${environment.apiUrl}Customer/GetLanguageResources?LanguageId=${lang}`; // Replace with your API endpoint

    this.http.get(apiUrl).subscribe(
      (translations: any) => {
        let filteredTranslations = this.convertToTranslationObject(translations.data);
        this.translate.setTranslation(lang, filteredTranslations, true); // true: merge translations
        this.translate.use(lang); // Apply the language
      },
      (error) => {
        console.error('Error loading translations:', error);
      }
    );
  }
  convertToTranslationObject(data: any[]): Record<string, string> {
    const translations: Record<string, string> = {};
    data.forEach(item => {
      translations[item.key] = item.value; // Overwrites duplicate keys
    });
    return translations;
  }
}
