import { useState, useEffect } from 'react';

import { loadImage } from '@/utils';

export function useImage(url: Parameters<typeof loadImage>[0], crossOrigin: Parameters<typeof loadImage>[1] = true) {
    const [image, setImage] = useState<HTMLImageElement>();
    useEffect(() => {
        (async () => {
            const image = await loadImage(url, crossOrigin);
            setImage(() => image);
        })();
    }, [crossOrigin, url]);
    return image;
}
