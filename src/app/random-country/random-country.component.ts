import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CountryService } from '../services/country.service';
import { Holiday } from '../models/models';

@Component({
  selector: 'app-random-country',
  templateUrl: './random-country.component.html',
  styleUrls: ['./random-country.component.css'],
})
export class RandomCountryComponent implements OnChanges {
  @Input() country: { countryCode: string; name: string } | null = null;
  nextHoliday: { name: string; date: string } | null = null;

  constructor(private countryService: CountryService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['country'] && this.country) {
      this.getNextHoliday(this.country.countryCode);
    }
  }

  getNextHoliday(countryCode: string): void {
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;

    this.countryService
      .getCountryHolidays(currentYear, countryCode)
      .subscribe((currentYearHolidays: Holiday[]) => {
        this.countryService
          .getCountryHolidays(nextYear, countryCode)
          .subscribe((nextYearHolidays: Holiday[]) => {
            const allHolidays = [...currentYearHolidays, ...nextYearHolidays];
            const upcomingHolidays = this.getUpcomingHolidays(allHolidays);
            this.nextHoliday =
              upcomingHolidays.length > 0
                ? upcomingHolidays[0]
                : { name: 'No upcoming holidays', date: '' };
          });
      });
  }

  getUpcomingHolidays(holidays: Holiday[]): { name: string; date: string }[] {
    const today = new Date();
    const upcomingHolidays = holidays
      .filter((holiday) => {
        const holidayDate = new Date(holiday.date);
        return holidayDate >= today;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((holiday) => ({
        name: holiday.name,
        date: holiday.date,
      }));
    return upcomingHolidays;
  }
}
