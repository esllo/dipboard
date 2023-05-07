export function pngToUrl(bytes: number[]): string {
  const blob = new Blob([new Uint8Array(bytes)], { type: "image/png" });

  return URL.createObjectURL(blob);
}

export function releaseUrl(url: string) {
  URL.revokeObjectURL(url);
}
