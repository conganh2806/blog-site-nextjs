'use client';

import { MouseEvent, useEffect, useState } from 'react';

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => setIsVisible(window.scrollY >= 500);

    updateVisibility();
    window.addEventListener('scroll', updateVisibility, { passive: true });

    return () => window.removeEventListener('scroll', updateVisibility);
  }, []);

  const scrollToTop = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div id="go-top" className={isVisible ? 'is-visible' : ''}>
      <a
        title="Back to Top"
        href="#top"
        aria-label="Back to top"
        onClick={scrollToTop}
      >
        <i className="icon icon-arrow-up" aria-hidden="true" />
      </a>
    </div>
  );
}
