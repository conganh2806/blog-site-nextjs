'use client';

import Link from 'next/link';
import { FormEvent, MouseEvent, useState } from 'react';

export function Header() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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

        if (!keyword) {
            return;
        }

        console.log('Search keyword:', keyword);
    };

    return (
        <header className={`short-header ${isSearchOpen ? 'search-visible' : ''}`}>
            <div className="gradient-block" />

            <div className="row header-content">
                <div className="logo">
                    <Link href="/">Author</Link>
                </div>

                <nav id="main-nav-wrap" aria-label="Main navigation">
                    <ul className={`main-navigation sf-menu ${isMenuOpen ? 'is-open' : ''
                        }`}
                    >
                        <li className="current">
                            <Link href="/">Home</Link>
                        </li>

                        <li className="has-children">
                            <Link href="/category">Categories</Link>

                            <ul className="sub-menu">
                                <li>
                                    <Link href="/category?name=wordpress">Wordpress</Link>
                                </li>
                                <li>
                                    <Link href="/category?name=html">HTML</Link>
                                </li>
                                <li>
                                    <Link href="/category?name=photography">
                                        Photography
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/category?name=ui">UI</Link>
                                </li>
                                <li>
                                    <Link href="/category?name=mockups">Mockups</Link>
                                </li>
                                <li>
                                    <Link href="/category?name=branding">Branding</Link>
                                </li>
                            </ul>
                        </li>

                        <li className="has-children">
                            <Link href="/blog">Blog</Link>

                            <ul className="sub-menu">
                                <li>
                                    <Link href="/blog/video">Video Post</Link>
                                </li>
                                <li>
                                    <Link href="/blog/audio">Audio Post</Link>
                                </li>
                                <li>
                                    <Link href="/blog/gallery">Gallery Post</Link>
                                </li>
                                <li>
                                    <Link href="/blog/standard">Standard Post</Link>
                                </li>
                            </ul>
                        </li>

                        <li>
                            <Link href="/styles">Styles</Link>
                        </li>

                        <li>
                            <Link href="/about">About</Link>
                        </li>

                        <li>
                            <Link href="/contact">Contact</Link>
                        </li>
                    </ul>
                </nav>

                <div className="search-wrap">
                    <form
                        role="search"
                        className="search-form"
                        onSubmit={handleSearch}
                    >
                        <label>
                            <span className="hide-content">Search for:</span>

                            <input
                                type="search"
                                className="search-field"
                                placeholder="Type Your Keywords"
                                name="s"
                                title="Search for:"
                                autoComplete="off"
                            />
                        </label>

                        <input
                            type="submit"
                            className="search-submit"
                            value="Search"
                        />
                    </form>

                    <a
                        href="#"
                        id="close-search"
                        className="close-btn"
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
                        <svg
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="11" cy="11" r="7" />
                            <path d="m20 20-4-4" />
                        </svg>
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