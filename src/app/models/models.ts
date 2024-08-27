export interface Holiday {
  date: string;
  name: string;
  countryCode: string;
  launchYear: number | null;
  types: string[];
}

export interface Country {
  name: string;
  countryCode: string;
  nextHoliday?: Holiday;
}
