import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { FeaturedPosts } from '@/components/home/FeaturedPosts';
import { Pagination } from '@/components/home/Pagination';
import { PostGrid } from '@/components/home/PostGrid';

export default function HomePage() {
  return (
    <>
      <Header />

      <main>
        <section id="bricks">
          <FeaturedPosts />
          <PostGrid />
          <Pagination />
        </section>
      </main>

      <Footer />
    </>
  );
}