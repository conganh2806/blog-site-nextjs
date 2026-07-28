export function Footer() {
  return (
    <footer>
      <div className="footer-main">
        <div className="row">
          <section className="col-four tab-full mob-full footer-info">
            <h4>About Our Site</h4>

            <p>
              Lorem ipsum Ut velit dolor Ut labore id fugiat in ut fugiat
              nostrud qui in dolore commodo eu magna Duis cillum dolor officia
              esse mollit proident Excepteur exercitation nulla.
            </p>
          </section>

          <nav
            className="col-two tab-1-3 mob-1-2 site-links"
            aria-label="Site links"
          >
            <h4>Site Links</h4>

            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Terms</a></li>
              <li><a href="#">Privacy Policy</a></li>
            </ul>
          </nav>

          <nav
            className="col-two tab-1-3 mob-1-2 social-links"
            aria-label="Social links"
          >
            <h4>Social</h4>

            <ul>
              <li><a href="#">Twitter</a></li>
              <li><a href="#">Facebook</a></li>
              <li><a href="#">Dribbble</a></li>
              <li><a href="#">Google+</a></li>
              <li><a href="#">Instagram</a></li>
            </ul>
          </nav>

          <section className="col-four tab-1-3 mob-full footer-subscribe">
            <h4>Subscribe</h4>

            <p>Keep yourself updated. Subscribe to our newsletter.</p>

            <div className="subscribe-form">
              <form id="mc-form" className="group" noValidate>
                <input
                  type="email"
                  name="dEmail"
                  className="email"
                  id="mc-email"
                  placeholder="Type & press enter"
                  required
                />

                <input
                  type="submit"
                  name="subscribe"
                  value="Subscribe"
                />

                <label
                  htmlFor="mc-email"
                  className="subscribe-message"
                />
              </form>
            </div>
          </section>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="row">
          <div className="col-twelve">
            <div className="copyright">
              <span>© Copyright Abstract 2016</span>
              <span>
                Design by{' '}
                <a
                  href="https://www.styleshout.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  styleshout
                </a>
              </span>
            </div>

            <div id="go-top">
              <a title="Back to Top" href="#top" aria-label="Back to top">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m18 15-6-6-6 6" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}