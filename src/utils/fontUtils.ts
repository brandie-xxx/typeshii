/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Extracts font name from a Google Fonts URL or <link> tag.
 */
export function extractFontName(input: string): string | null {
  // Extract URL from the link containing the font family
  // We look for the one with fonts.googleapis.com/css2
  let url = input;
  
  // If we have multiple hrefs, find the one that looks like a Google Fonts CSS API
  const urls = Array.from(input.matchAll(/href="([^"]+)"/g)).map(m => m[1]);
  const fontUrl = urls.find(u => u.includes('fonts.googleapis.com/css2')) || urls[0];
  
  if (fontUrl) {
    url = fontUrl;
  }

  // Pattern: family=Font+Name or family=FontName
  const match = url.match(/family=([^&:]+)/);
  
  if (match) {
    return decodeURIComponent(match[1].replace(/\+/g, ' '));
  }
  
  return null;
}

/**
 * Generates optimized <link> code for a font URL.
 */
export function getOptimizedLinkCode(url: string): string {
  // Ensure we have display=swap
  let processedUrl = url;
  if (!processedUrl.includes('display=swap')) {
    processedUrl += processedUrl.includes('?') ? '&display=swap' : '?display=swap';
  }

  return `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${processedUrl}" rel="stylesheet">`;
}

/**
 * Generates CSS font-family code.
 */
export function getCssCode(fontName: string): string {
  return `font-family: '${fontName}', sans-serif;`;
}
