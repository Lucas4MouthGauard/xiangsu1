export function formatExportName(params: {
  brand: string;
  kind: 'laser' | 'pill' | 'mbti';
  date?: Date;
}) {
  const d = params.date ?? new Date();
  const yyyy = d.getFullYear();
  const MM = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const HH = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${params.brand}_${yyyy}${MM}${dd}_${HH}${mm}_${params.kind}.png`;
}