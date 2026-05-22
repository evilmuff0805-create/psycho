export default function WeekNavigation({ weekMonday, onPrev, onNext }) {
  const label = formatWeekLabel(weekMonday);
  return (
    <div className="week-navigation">
      <button onClick={onPrev} aria-label="이전 주">&#8249;</button>
      <span className="week-label">{label}</span>
      <button onClick={onNext} aria-label="다음 주">&#8250;</button>
    </div>
  );
}

function formatWeekLabel(monday) {
  const end = new Date(monday);
  end.setDate(end.getDate() + 6);
  const fmt = (d) =>
    `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  return `${fmt(monday)} – ${fmt(end)}`;
}
