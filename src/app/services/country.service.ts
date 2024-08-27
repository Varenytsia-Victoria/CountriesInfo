import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Country, Holiday } from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  private baseUrl = environment.API_BASE_URL;

  constructor(private http: HttpClient) {}

  getAvailableCountries(): Observable<Country[]> {
    return this.http.get<Country[]>(`${this.baseUrl}/AvailableCountries`);
  }

  searchCountries(query: string): Observable<Country[]> {
    return this.getAvailableCountries().pipe(
      map((countries) =>
        countries.filter((country) =>
          country.name.toLowerCase().includes(query.toLowerCase()),
        ),
      ),
    );
  }
  getPublicHolidays(year: number, countryCode: string): Observable<Holiday[]> {
    return this.http.get<Holiday[]>(
      `${this.baseUrl}/PublicHolidays/${year}/${countryCode}`,
    );
  }
  getRandomCountries(count: number): Observable<Country[]> {
    return this.getAvailableCountries().pipe(
      map((countries: Country[]) => {
        const randomCountries: Country[] = [];
        while (randomCountries.length < count) {
          const randomIndex = Math.floor(Math.random() * countries.length);
          const randomCountry = countries[randomIndex];
          if (!randomCountries.includes(randomCountry)) {
            randomCountries.push(randomCountry);
          }
        }
        return randomCountries;
      }),
    );
  }

  getCountryInfo(countryCode: string): Observable<Country> {
    return this.http.get<Country>(`${this.baseUrl}/CountryInfo/${countryCode}`);
  }

  getCountryHolidays(year: number, countryCode: string): Observable<Holiday[]> {
    return this.http.get<Holiday[]>(
      `${this.baseUrl}/PublicHolidays/${year}/${countryCode}`,
    );
  }
}
