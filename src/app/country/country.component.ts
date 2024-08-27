import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CountryService } from '../services/country.service';
import { Holiday } from '../models/models';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css'],
})
export class CountryComponent implements OnInit {
  countryCode: string | null = null;
  countryName: string | null = null;
  holidays: Holiday[] = [];
  currentYear: number = new Date().getFullYear();
  years: number[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private countryService: CountryService,
    private router: Router,
  ) {
    this.initializeYears();
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.countryCode = params.get('code');
      if (this.countryCode) {
        this.fetchCountryDetails();
        this.fetchHolidays(this.currentYear);
      }
    });
  }

  initializeYears(): void {
    this.years = [];
    for (let i = 2020; i <= 2030; i++) {
      this.years.push(i);
    }
  }

  fetchCountryDetails(): void {
    if (this.countryCode) {
      this.countryService.getCountryInfo(this.countryCode).subscribe(
        (data) => {
          this.countryName = data?.commonName || 'Unknown Country';
        },
        (error) => {
          alert(`Error fetching country details: ${error.message}`);
        },
      );
    }
  }

  fetchHolidays(year: number): void {
    if (this.countryCode) {
      this.countryService.getCountryHolidays(year, this.countryCode).subscribe(
        (data) => {
          this.holidays = data;
        },
        (error) => {
          alert(`Error fetching holidays: ${error.message}`);
        },
      );
    }
  }

  changeYear(year: number): void {
    this.currentYear = year;
    this.fetchHolidays(year);
  }

  navigateToHome(): void {
    this.router.navigate(['/']);
  }
}
