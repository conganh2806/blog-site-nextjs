'use client';

import { ReactNode, useEffect, useRef } from 'react';

interface MasonryGridProps {
  children: ReactNode;
}

export function MasonryGrid({ children }: MasonryGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;

    if (!grid) {
      return;
    }

    let isDisposed = false;
    let disposePlugins = () => {};

    void Promise.all([
      import('imagesloaded'),
      import('masonry-layout'),
    ]).then(([imagesLoadedModule, masonryModule]) => {
      if (isDisposed) {
        return;
      }

      const imagesLoaded = imagesLoadedModule.default;
      const Masonry = masonryModule.default;
      const masonry = new Masonry(grid, {
        columnWidth: '.grid-sizer',
        itemSelector: '.entry',
        percentPosition: true,
        resize: true,
      });

      const loader = imagesLoaded(grid);
      const updateLayout = () => masonry.layout?.();

      loader.on('progress', updateLayout);
      loader.on('always', updateLayout);

      disposePlugins = () => {
        loader.off('progress', updateLayout);
        loader.off('always', updateLayout);
        masonry.destroy?.();
      };
    });

    return () => {
      isDisposed = true;
      disposePlugins();
    };
  }, []);

  return (
    <div className="row masonry">
      <div ref={gridRef} className="bricks-wrapper">
        <div className="grid-sizer" />
        {children}
      </div>
    </div>
  );
}
