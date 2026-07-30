import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn more about the Abstract team and how we work.',
};

const details = [
  { heading: 'Who.', text: 'Lorem ipsum Nisi amet fugiat eiusmod et aliqua ad qui ut nisi Ut aute anim mollit fugiat qui sit ex occaecat et eu mollit nisi pariatur fugiat deserunt dolor veniam reprehenderit aliquip magna nisi consequat aliqua veniam in aute ullamco Duis laborum ad non pariatur sit.' },
  { heading: 'When.', text: 'Lorem ipsum Nisi amet fugiat eiusmod et aliqua ad qui ut nisi Ut aute anim mollit fugiat qui sit ex occaecat et eu mollit nisi pariatur fugiat deserunt dolor veniam reprehenderit aliquip magna nisi consequat aliqua veniam in aute ullamco Duis laborum ad non pariatur sit.' },
  { heading: 'What.', text: 'Lorem ipsum Nisi amet fugiat eiusmod et aliqua ad qui ut nisi Ut aute anim mollit fugiat qui sit ex occaecat et eu mollit nisi pariatur fugiat deserunt dolor veniam reprehenderit aliquip magna nisi consequat aliqua veniam in aute ullamco Duis laborum ad non pariatur sit.' },
  { heading: 'How.', text: 'Lorem ipsum Nisi amet fugiat eiusmod et aliqua ad qui ut nisi Ut aute anim mollit fugiat qui sit ex occaecat et eu mollit nisi pariatur fugiat deserunt dolor veniam reprehenderit aliquip magna nisi consequat aliqua veniam in aute ullamco Duis laborum ad non pariatur sit.' },
];

export default function AboutPage() {
  return (
    <main>
        <section id="content-wrap" className="site-page">
          <div className="row">
            <div className="col-twelve">
              <section>
                <div className="content-media">
                  <Image
                    src="/images/thumbs/about-us.jpg"
                    alt="The Abstract creative team"
                    width={1300}
                    height={650}
                    sizes="(max-width: 960px) 100vw, 950px"
                    style={{ width: '100%', height: 'auto' }}
                    priority
                  />
                </div>

                <div className="primary-content">
                  <h1 className="entry-title add-bottom">
                    Learn More About Us.
                  </h1>

                  <p className="lead">
                    Lorem ipsum Nisi cillum reprehenderit minim sunt dolore
                    dolor eiusmod eu aliquip ad ut sint dolore laborum voluptate
                    ullamco dolore aliquip enim. Excepteur cillum cupidatat
                    fugiat nostrud cupidatat dolor sunt sint sit nisi est eu
                    exercitation incididunt adipisicing.
                  </p>

                  <p>
                    Duis ex ad cupidatat tempor Excepteur cillum cupidatat
                    fugiat nostrud cupidatat dolor sunt sint sit nisi est eu
                    exercitation incididunt adipisicing veniam velit id fugiat
                    enim mollit amet anim veniam dolor dolor irure velit commodo
                    cillum sit nulla ullamco magna amet magna cupidatat.
                  </p>

                  <p>
                    Lorem ipsum Cillum sit sunt dolore non aute enim pariatur
                    deserunt magna reprehenderit veniam officia ullamco eiusmod
                    laborum commodo veniam elit proident enim sit cillum ex
                    aliquip dolore labore sint ut deserunt officia.
                  </p>

                  <div className="row block-1-2 block-tab-full">
                    {details.map((detail) => (
                      <div key={detail.heading} className="bgrid">
                        <h3>{detail.heading}</h3>
                        <p>{detail.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>
          </div>
        </section>
    </main>
  );
}
