import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'unicodeDecode',
})
export class UnicodeDecodePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return value;

    // Decode unicode escapes like \u003c to actual characters
    return value.replace(/\\u[\dA-F]{4}/gi, (match) => {
      return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
    });
  }
}
