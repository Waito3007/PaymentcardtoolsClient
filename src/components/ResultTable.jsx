import ResultBadge from "./ResultBadge";

const ResultTable = ({ details, onCopyRow }) => {
  if (!details?.length) return null;

  return (
    <div className="table-wrapper">
      <div className="table-head">
        <span>#</span>
        <span>Key</span>
        <span>Trang thai</span>
        <span>Message</span>
        <span>KCV</span>
        {onCopyRow && <span>Copy</span>}
      </div>
      {details.map((item, idx) => (
        <div className="table-row" key={`${item.inputKey}-${idx}`}>
          <span className="mono">{idx + 1}</span>
          <span className="mono">{item.inputKey}</span>
          <ResultBadge status={item.status} />
          <span>{item.message}</span>
          <span className="mono">{item.kcv || "-"}</span>
          {onCopyRow && (
            <button
              type="button"
              className="inline-btn"
              onClick={() => onCopyRow(item.inputKey)}
            >
              Copy
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default ResultTable;
