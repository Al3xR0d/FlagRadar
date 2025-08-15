export function getFileNameFromContentDisposition(header?: string | null): string | null {
    if (!header) return null;
    const filenameStar = /filename\*=UTF-8''([^;]+)/i.exec(header);
    if (filenameStar && filenameStar[1]) {
      try {
        return decodeURIComponent(filenameStar[1].trim());
      } catch {
        return filenameStar[1].trim();
      }
    }
    const filenameMatch = /filename="?([^";]+)"?/i.exec(header);
    if (filenameMatch && filenameMatch[1]) return filenameMatch[1].trim();
    return null;
  }