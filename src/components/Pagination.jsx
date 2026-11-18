export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)

  return (
    <nav className="pagination" aria-label="Pagination">
      <button
        className="pagination-button pagination-step"
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
      >
        ← Previous
      </button>

      <ul className="pagination-pages">
        {pages.map((number) => (
          <li key={number}>
            <button
              className="pagination-button pagination-number"
              type="button"
              onClick={() => onChange(number)}
              aria-label={`Go to page ${number}`}
              aria-current={number === page ? 'page' : undefined}
            >
              {number}
            </button>
          </li>
        ))}
      </ul>

      <button
        className="pagination-button pagination-step"
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
      >
        Next →
      </button>
    </nav>
  )
}
