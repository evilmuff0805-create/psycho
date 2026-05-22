const DAY_NAMES = ['월', '화', '수', '목', '금', '토', '일'];

export default function DayHeader({ date }) {
  const today = new Date();
  const isToday =
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();

  const dayName = DAY_NAMES[date.getDay() === 0 ? 6 : date.getDay() - 1];
  const dateLabel = `${date.getMonth() + 1}/${date.getDate()}`;

  return (
    <div className={`day-header${isToday ? ' today' : ''}`}>
      <span className="day-name">{dayName}</span>
      <span className="day-date">{dateLabel}</span>
    </div>
  );
}
