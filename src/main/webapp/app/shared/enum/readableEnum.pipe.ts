import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'readableEnum',
})
export class ReadableEnumPipe implements PipeTransform {
  transform(value: string | null | undefined, enumObj: Record<string, string>): string {
    if (!value || !(value in enumObj)) {
      return 'Unsupported Type';
    }

    return value
      .replace(/[-_]/g, ' ') // Replace dashes and underscores with spaces
      .toLowerCase()
      .replace(/\b\w/g, char => char.toUpperCase()); // Capitalize first letter of each word
  }
}
