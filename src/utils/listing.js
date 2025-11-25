export const filterDetails = (details, filterStatus) => {
  if (!details) return [];
  if (filterStatus === "valid") return details.filter((d) => d.status === 1);
  if (filterStatus === "invalid") return details.filter((d) => d.status !== 1);
  return details;
};

export const paginate = (list, page, pageSize) => {
  const totalPages = Math.max(1, Math.ceil((list?.length || 0) / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  const slice = (list || []).slice(start, start + pageSize);
  return { slice, totalPages, safePage };
};
