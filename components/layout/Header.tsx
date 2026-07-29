'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FormEvent,
  MouseEvent,
  useEffect,
  useRef,
  useState,
} from 'react';

interface NavigationItem {
  href: string;
  label: string;
  children?: NavigationItem[];
}

const navigationItems: NavigationItem[] = [
  { href: '/', label: 'Home' },
  {
    href: '/category',
    label: 'Categories',
    children: [
      { href: '/category?name=wordpress', label: 'Wordpress' },
      { href: '/category?name=html', label: 'HTML' },
      { href: '/category?name=photography', label: 'Photography' },
      { href: '/category?name=ui', label: 'UI' },
      { href: '/category?name=mockups', label: 'Mockups' },
      { href: '/category?name=branding', label: 'Branding' },
    ],
  },
  {
    href: '/blog',
    label: 'Blog',
    children: [
      { href: '/blog/video', label: 'Video Post' },
      { href: '/blog/audio', label: 'Audio Post' },
      { href: '/blog/gallery', label: 'Gallery Post' },
      { href: '/blog/standard', label: 'Standard Post' },
    ],
  },
  { href: '/styles', label: 'Styles' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export function Header() {
  const pathname = usePathname();
  const searchFieldRef = useRef<HTMLInputElement>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (!isSearchOpen) {
      return;
    }

    const focusTimer = window.setTimeout(() => {
      searchFieldRef.current?.focus();
    }, 100);

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('keydown', closeOnEscape);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [isSearchOpen]);

  const openSearch = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setIsSearchOpen(true);
  };

  const closeSearch = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setIsSearchOpen(false);
  };

  const toggleMenu = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setIsMenuOpen((currentValue) => !currentValue);
  };

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const keyword = formData.get('s')?.toString().trim();

    if (keyword) {
      window.location.assign(`/?search=${encodeURIComponent(keyword)}`);
    }
  };

  const isCurrentRoute = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }

    return pathname.startsWith(href);
  };

  return (
    <header className={`short-header ${isSearchOpen ? 'search-visible' : ''}`}>
      <div className="gradient-block" />

      <div className="row header-content">
        <div className="logo">
          <Link href="/">Author</Link>
        </div>

        <nav id="main-nav-wrap" aria-label="Main navigation">
          <ul
            className={`main-navigation sf-menu ${isMenuOpen ? 'is-open' : ''}`}
          >
            {navigationItems.map((item) => (
              <li
                key={item.label}
                className={[
                  isCurrentRoute(item.href) ? 'current' : '',
                  item.children ? 'has-children' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <Link
                  href={item.href}
                  aria-haspopup={item.children ? 'true' : undefined}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>

                {item.children && (
                  <ul className="sub-menu">
                    {item.children.map((child) => (
                      <li key={child.label}>
                        <Link
                          href={child.href}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div
          className="search-wrap"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setIsSearchOpen(false);
            }
          }}
        >
          <form
            role="search"
            className="search-form"
            onSubmit={handleSearch}
          >
            <label>
              <span className="hide-content">Search for:</span>
              <input
                ref={searchFieldRef}
                type="search"
                className="search-field"
                placeholder="Type Your Keywords"
                name="s"
                title="Search for:"
                autoComplete="off"
              />
            </label>

            <input type="submit" className="search-submit" value="Search" />
          </form>

          <a
            href="#"
            id="close-search"
            className="close-btn"
            aria-label="Close search"
            onClick={closeSearch}
          >
            Close
          </a>
        </div>

        <div className="triggers">
          <a
            className="search-trigger"
            href="#"
            aria-label="Open search"
            onClick={openSearch}
          >
            <i className="fa fa-search" aria-hidden="true" />
          </a>

          <a
            className={`menu-toggle ${isMenuOpen ? 'is-clicked' : ''}`}
            href="#"
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
            onClick={toggleMenu}
          >
            <span>Menu</span>
          </a>
        </div>
      </div>
    </header>
  );
}
