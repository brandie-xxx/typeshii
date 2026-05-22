/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SavedFont {
  id: string;
  name: string;
  url: string;
  dateAdded: number;
  isFavorite?: boolean;
}

export interface SavedColor {
  id: string;
  hex: string;
  name?: string;
  dateAdded: number;
}
