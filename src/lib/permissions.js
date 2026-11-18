export const ROLE_PAGES = {
  Admin: ['Dashboard','Patients','Doctors','Appointments','Billing','Ward & Beds','Calendar','Settings'],
  Doctor: ['Dashboard','Patients','Doctors','Appointments','Calendar'],
  Receptionist: ['Dashboard','Patients','Appointments','Billing','Calendar']
};
export function canAccess(role, page) {
  return Boolean(ROLE_PAGES[role]?.includes(page));
}
export function paginate(items, page = 1, pageSize = 5) {
  const safeSize = Math.max(1, Number(pageSize) || 5);
  const totalPages = Math.max(1, Math.ceil(items.length / safeSize));
  const currentPage = Math.min(Math.max(1, Number(page) || 1), totalPages);
  return { items: items.slice((currentPage - 1) * safeSize, currentPage * safeSize), page: currentPage, totalPages };
}
export function toCSV(rows) {
  if (!rows?.length) return '';
  const keys = Object.keys(rows[0]);
  return [keys.join(','), ...rows.map(row => keys.map(key => `"${String(row[key] ?? '').replaceAll('"','""')}"`).join(','))].join('\n');
}
