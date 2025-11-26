const Toolbar = ({
  filterStatus,
  onFilterChange,
  onExportValid,
  onExportInvalid,
  onExportFull,
  onCopyAll,
  disableValid,
  disableInvalid,
  disableFull,
  disableCopyAll,
}) => (
  <div className="toolbar">
    <div className="filter-group">
      <span>Loc:</span>
      <button
        type="button"
        className={`chip ${filterStatus === "all" ? "active" : ""}`}
        onClick={() => onFilterChange("all")}
      >
        Tat ca
      </button>
      <button
        type="button"
        className={`chip ${filterStatus === "valid" ? "active" : ""}`}
        onClick={() => onFilterChange("valid")}
      >
        Hop le
      </button>
      <button
        type="button"
        className={`chip ${filterStatus === "invalid" ? "active" : ""}`}
        onClick={() => onFilterChange("invalid")}
      >
        Khong hop le
      </button>
    </div>
    <div className="export-group">
      <button type="button" disabled={disableValid} onClick={onExportValid}>
        Xuất key hợp lệ (.txt)
      </button>
      <button type="button" disabled={disableInvalid} onClick={onExportInvalid}>
        Xuất key không hợp lệ (.txt)
      </button>
      <button type="button" disabled={disableFull} onClick={onExportFull}>
        Xuất file đầy đủ (.csv)
      </button>
      {onCopyAll && (
        <button type="button" disabled={disableCopyAll} onClick={onCopyAll}>
          Copy tất cả
        </button>
      )}
    </div>
  </div>
);

export default Toolbar;
