const SummaryCard = ({ label, value }) => (
  <div className="stat-card">
    <p className="stat-label">{label}</p>
    <p className="stat-value">{value ?? "-"}</p>
  </div>
);

export default SummaryCard;
