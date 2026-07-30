import { HomeContent } from '@/components/home/HomeContent';
import { Pagination } from '@/components/home/Pagination';

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
