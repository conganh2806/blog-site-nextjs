import { GalleryPost } from './GalleryPost';
import { PostCard } from './PostCard';

const excerpt =
  'Lorem ipsum Sed eiusmod esse aliqua sed incididunt aliqua incididunt mollit id et sit proident dolor nulla sed commodo est ad minim elit reprehenderit nisi officia aute incididunt velit sint in aliqua cillum in consequat consequat in culpa in anim.';

export function PostGrid() {
  return (
    <>
      <PostCard
        alt="building"
        categories={['Design', 'Photography']}
        excerpt={excerpt}
        formatClass="format-standard"
        image="/images/thumbs/diagonal-building.jpg"
        imageHeight={700}
        title="Just a Standard Format Post."
      />

      <PostCard
        alt="ferris wheel"
        categories={['Design', 'UI']}
        excerpt={excerpt}
        formatClass="format-standard"
        image="/images/thumbs/ferris-wheel.jpg"
        imageHeight={800}
        title="This Is Another Standard Format Post."
      />

      <PostCard
        alt="concert"
        categories={['Design', 'Music']}
        excerpt={excerpt}
        formatClass="format-audio"
        href="/blog/audio"
        image="/images/thumbs/concert.jpg"
        imageHeight={800}
        media={
          <div className="audio-wrap">
            <audio
              src="/media/AirReview-Landmarks-02-ChasingCorporate.mp3"
              controls
              preload="metadata"
            >
              Your browser does not support audio playback.
            </audio>
          </div>
        }
        title="This Is a Audio Format Post."
      />

      <article className="brick entry format-quote">
        <div className="entry-thumb">
          <blockquote>
            <p>
              Good design is making something intelligible and memorable.
              Great design is making something memorable and meaningful.
            </p>
            <cite>Dieter Rams</cite>
          </blockquote>
        </div>
      </article>

      <PostCard
        alt="Shutterbug"
        categories={['Photography', 'HTML']}
        excerpt={excerpt}
        image="/images/thumbs/shutterbug.jpg"
        imageHeight={700}
        title="Photography Skills Can Improve Your Graphic Design."
      />

      <PostCard
        alt="USAF rocket"
        categories={['Branding', 'Mockup']}
        excerpt={excerpt}
        image="/images/thumbs/usaf-rocket.jpg"
        imageHeight={1000}
        title="The 10 Golden Rules of Clean Simple Design."
      />

      <GalleryPost excerpt={excerpt} />

      <article className="brick entry format-link">
        <div className="entry-thumb">
          <div className="link-wrap">
            <p>
              Looking for affordable &amp; reliable web hosting? We recommend
              Dreamhost.
            </p>
            <cite>
              <a
                href="https://www.dreamhost.com"
                target="_blank"
                rel="noreferrer"
              >
                https://www.dreamhost.com
              </a>
            </cite>
          </div>
        </div>
      </article>

      <PostCard
        alt="Pattern"
        categories={['Design', 'UI']}
        excerpt={excerpt}
        image="/images/thumbs/diagonal-pattern.jpg"
        imageHeight={700}
        title="You Can See Patterns Everywhere."
      />

      <PostCard
        alt="bokeh"
        categories={['Design', 'Branding']}
        excerpt={excerpt}
        formatClass="format-video"
        href="/blog/video"
        image="/images/thumbs/ottawa-bokeh.jpg"
        imageHeight={900}
        thumbHref="https://player.vimeo.com/video/14592941"
        title="This Is a Video Post Format."
      />

      <PostCard
        alt="Lighthouse"
        categories={['Photography', 'Design']}
        excerpt={excerpt}
        image="/images/thumbs/lighthouse.jpg"
        imageHeight={900}
        title="Breathtaking Photos of Lighthouses."
      />

      <PostCard
        alt="Liberty"
        categories={['Branding', 'HTML']}
        excerpt={excerpt}
        image="/images/thumbs/liberty.jpg"
        imageHeight={1000}
        title="Designing With Black and White."
      />
    </>
  );
}
