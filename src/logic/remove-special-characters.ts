export type RemoveSpecialMode = 'alphanumeric-only' | 'alphanumeric-spaces' | 'custom-whitelist';

export interface RemoveSpecialOptions {
  mode: RemoveSpecialMode;
  customWhitelist: string;
}

export function removeSpecialCharacters(text: string, options: RemoveSpecialOptions): string {
  if (!text) return '';

  switch (options.mode) {
    case 'alphanumeric-only':
      return text.replace(/[^a-zA-Z0-9]/g, '');

    case 'alphanumeric-spaces':
      return text.replace(/[^a-zA-Z0-9\s]/g, '');

    case 'custom-whitelist': {
      if (!options.customWhitelist) return text.replace(/[^a-zA-Z0-9\s]/g, '');
      const escaped = options.customWhitelist.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
      const pattern = new RegExp(`[^a-zA-Z0-9${escaped}]`, 'g');
      return text.replace(pattern, '');
    }

    default:
      return text;
  }
}
