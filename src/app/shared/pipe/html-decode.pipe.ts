import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'htmlDecode',
})
export class HtmlDecodePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return value;

    // Replace `some code` with <code>some code</code>
    return value.replace(/`([^`]+)`/g, '<code>$1</code>');
  }
}
