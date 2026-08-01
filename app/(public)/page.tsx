import { HomeContent } from '@/components/home/home-content';
import { Pagination } from '@/components/home/pagination';

export default function HomePage() {
  return (
    <main>
      <section id="bricks">
        <HomeContent />
        <Pagination />
      </section>
    </main>
  );
}
