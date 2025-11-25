const statusLabels = {
  1: "Valid",
  2: "Invalid Format",
  3: "Invalid Length",
  4: "Bad Parity",
  5: "Weak Key",
};

const statusTone = {
  1: "success",
  2: "error",
  3: "warning",
  4: "warning",
  5: "muted",
};

const ResultBadge = ({ status }) => (
  <span className={`status-chip ${statusTone[status] || "muted"}`}>
    {statusLabels[status] || "Unknown"}
  </span>
);

export default ResultBadge;
