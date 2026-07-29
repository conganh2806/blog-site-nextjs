'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const featuredPosts = [
  {
    author: 'Naruto Uzumaki',
    date: 'September 06, 2016',
    image: '/images/thumbs/featured/featured-1.jpg',
    title: 'Minimalism Never Goes Out of Style',
  },
  {
    author: 'Sasuke Uchiha',
    date: 'August 29, 2016',
    image: '/images/thumbs/featured/featured-2.jpg',
    title: 'Enhancing Your Designs with Negative Space',
  },
  {
    author: 'Naruto Uzumaki',
    date: 'August 27, 2016',
    image: '/images/thumbs/featured/featured-3.jpg',
    title: 'Music Album Cover Designs for Inspiration',
  },
];

export function FeaturedPosts() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveSlide((currentSlide) =>
        (currentSlide + 1) % featuredPosts.length
      );
    }, 7000);

    return () => window.clearInterval(intervalId);
  }, []);

  const showPreviousSlide = () => {
    setActiveSlide((currentSlide) =>
      (currentSlide - 1 + featuredPosts.length) % featuredPosts.length
    );
  };

  const showNextSlide = () => {
    setActiveSlide((currentSlide) =>
      (currentSlide + 1) % featuredPosts.length
    );
  };

  return (
    <div className="brick entry featured-grid">
      <div className="entry-content">
        <div
          id="featured-post-slider"
          className="flexslider react-slider"
          aria-label="Featured posts"
        >
          <ul className="slides" aria-live="polite">
            {featuredPosts.map((post, index) => (
              <li
                key={post.title}
                className={index === activeSlide ? 'is-active' : ''}
                aria-hidden={index !== activeSlide}
              >
                <div className="featured-post-slide">
                  <div
                    className="post-background"
                    style={{ backgroundImage: `url("${post.image}")` }}
                  />
                  <div className="overlay" />

                  <div className="post-content">
                    <ul className="entry-meta">
                      <li>{post.date}</li>
                      <li>
                        <Link href="/about">{post.author}</Link>
                      </li>
                    </ul>

                    <h1 className="slide-title">
                      <Link href="/blog/standard">{post.title}</Link>
                    </h1>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <ul className="flex-direction-nav" aria-label="Slider controls">
            <li className="flex-nav-prev">
              <button
                type="button"
                className="flex-prev"
                aria-label="Previous featured post"
                onClick={showPreviousSlide}
              >
                Previous
              </button>
            </li>

            <li className="flex-nav-next">
              <button
                type="button"
                className="flex-next"
                aria-label="Next featured post"
                onClick={showNextSlide}
              >
                Next
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
