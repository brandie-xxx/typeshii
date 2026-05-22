/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';

/**
 * Custom React Hook to dynamically inject style sheets (like Google Fonts)
 * into the documents' head on mount, and clean them up on unmount or URL change.
 *
 * @param url The stylesheet URL to load dynamically.
 */
export function useLoadFont(url: string | null | undefined): void {
  useEffect(() => {
    if (!url || !url.trim().startsWith('http')) {
      return;
    }

    const link = document.createElement('link');
    link.href = url.trim();
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, [url]);
}
