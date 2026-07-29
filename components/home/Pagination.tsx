import Link from 'next/link';

const pageNumbers = [2, 3, 4, 5, 6, 7, 8, 9];

export function Pagination() {
  return (
    <div className="row">
      <nav className="pagination" aria-label="Blog pagination">
        <span className="page-numbers prev inactive">Prev</span>
        <span className="page-numbers current" aria-current="page">
          1
        </span>

        {pageNumbers.map((pageNumber) => (
          <Link
            key={pageNumber}
            href={`/?page=${pageNumber}`}
            className="page-numbers"
          >
            {pageNumber}
          </Link>
        ))}

        <Link href="/?page=2" className="page-numbers next">
          Next
        </Link>
      </nav>
    </div>
  );
}
