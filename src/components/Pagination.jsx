const Pagination = ({ page, totalPages, onChange }) => {
  if (totalPages <= 1) return null;
  const prev = () => onChange(Math.max(1, page - 1));
  const next = () => onChange(Math.min(totalPages, page + 1));

  return (
    <div className="pagination">
      <button
        type="button"
        className="page-btn"
        onClick={() => onChange(1)}
        disabled={page === 1}
      >
        {"<<"}
      </button>
      <button
        type="button"
        className="page-btn"
        onClick={prev}
        disabled={page === 1}
      >
        {"<"}
      </button>
      <span className="page-info">
        Trang {page} / {totalPages}
      </span>
      <button
        type="button"
        className="page-btn"
        onClick={next}
        disabled={page === totalPages}
      >
        {">"}
      </button>
      <button
        type="button"
        className="page-btn"
        onClick={() => onChange(totalPages)}
        disabled={page === totalPages}
      >
        {">>"}
      </button>
    </div>
  );
};

export default Pagination;
