import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CountryService } from '../services/country.service';
import { Country } from '../models/models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  countries: Country[] = [];
  searchQuery: string = '';
  randomCountries: Country[] = [];
  selectedCountries: Country[] = [];

  constructor(
    private countryService: CountryService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.getRandomCountries();
  }

  getRandomCountries(): void {
    this.countryService.getRandomCountries(3).subscribe((data: Country[]) => {
      this.randomCountries = data;
    });
  }

  addCountryToSelection(country: Country): void {
    if (
      !this.selectedCountries.find((c) => c.countryCode === country.countryCode)
    ) {
      this.selectedCountries.push(country);
    }
    this.countries = [];
  }

  searchCountries(): void {
    if (this.searchQuery.trim() === '') {
      this.countries = [];
      return;
    }

    this.countryService.searchCountries(this.searchQuery).subscribe(
      (data: Country[]) => {
        this.countries = data;
      }
    );
  }

  navigateToCountry(countryCode: string): void {
    if (countryCode) {
      this.router.navigate(['/country', countryCode]);
    } else {
      alert('Country code is undefined');
    }
  }
}
