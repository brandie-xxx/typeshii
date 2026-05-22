/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Validates whether a string is a valid CSS hex color
 */
export function isValidHex(hex: string): boolean {
  return /^#?([0-9A-F]{3}){1,2}$/i.test(hex.replace(/\s+/g, ''));
}

/**
 * Automatically calculates a stylish aesthetic name for any HEX color based on its color components!
 */
export function getAestheticColorName(hex: string): string {
  // Normalize hex
  let cleaned = hex.trim().replace('#', '');
  if (cleaned.length === 3) {
    cleaned = cleaned.split('').map(char => char + char).join('');
  }

  if (cleaned.length !== 6) {
    return 'Mystic Ink';
  }

  const r = parseInt(cleaned.slice(0, 2), 16);
  const g = parseInt(cleaned.slice(2, 4), 16);
  const b = parseInt(cleaned.slice(4, 6), 16);

  // Convert to HSL for beautiful categorization
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case rNorm:
        h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0);
        break;
      case gNorm:
        h = (bNorm - rNorm) / d + 2;
        break;
      case bNorm:
        h = (rNorm - gNorm) / d + 4;
        break;
    }
    h /= 6;
  }

  const hueDegrees = h * 360;
  const satPercent = s * 100;
  const lightPercent = l * 100;

  // Aesthetic color vocabulary matching
  if (lightPercent < 15) {
    if (satPercent < 12) return 'Obsidian Carbon';
    if (hueDegrees < 40) return 'Noir Ochre';
    if (hueDegrees < 160) return 'Jungle Abyss';
    if (hueDegrees < 280) return 'Deep Amethyst';
    return 'Midnight Plum';
  }
  
  if (lightPercent > 85) {
    if (satPercent < 10) return 'Pearl Solitude';
    if (hueDegrees < 60) return 'Ivory Dust';
    if (hueDegrees < 165) return 'Mint Breeze';
    if (hueDegrees < 250) return 'Ice Glacial';
    return 'Glaze Lavender';
  }

  if (satPercent < 15) {
    if (lightPercent < 40) return 'Slate Steel';
    if (lightPercent < 65) return 'Stone Pebble';
    return 'Sage Mist';
  }

  // Pure Hue-based aesthetic categories
  if (hueDegrees >= 345 || hueDegrees < 15) {
    if (satPercent > 70) return 'Crimson Electric';
    if (lightPercent < 50) return 'Terracotta Dusk';
    return 'Rose Petal';
  }
  if (hueDegrees >= 15 && hueDegrees < 45) {
    if (satPercent > 70) return 'Amber Flare';
    if (lightPercent < 50) return 'Rust Sienna';
    return 'Warm Peach';
  }
  if (hueDegrees >= 45 && hueDegrees < 75) {
    if (satPercent > 70) return 'Solar Gold';
    if (lightPercent < 50) return 'Harvest Olive';
    return 'Soft Butter';
  }
  if (hueDegrees >= 75 && hueDegrees < 165) {
    if (satPercent > 75) return 'Emerald Hyper';
    if (lightPercent < 45) return 'Forest Pine';
    if (lightPercent > 70) return 'Lichen Sprout';
    return 'Sage Jade';
  }
  if (hueDegrees >= 165 && hueDegrees < 255) {
    if (satPercent > 75) return 'Neon Lagoon';
    if (lightPercent < 45) return 'Ocean Indigo';
    if (lightPercent > 70) return 'Crystal Cyan';
    return 'Azure Bay';
  }
  if (hueDegrees >= 255 && hueDegrees < 315) {
    if (satPercent > 75) return 'Electric Violet';
    if (lightPercent < 45) return 'Plum Velvet';
    return 'Orchid Bloom';
  }
  
  // Pink/Raspberry
  if (satPercent > 75) return 'Cosmic Raspberry';
  return 'Mauve Mist';
}
