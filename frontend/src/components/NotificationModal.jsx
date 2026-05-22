export default function NotificationModal({ todos, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">🌅 오늘의 할일</h2>
        {todos.length === 0 ? (
          <p className="modal-empty">오늘 할일이 없습니다</p>
        ) : (
          <ul className="modal-list">
            {todos.map((todo) => (
              <li key={todo.id} className={todo.completed ? 'completed' : ''}>
                <span className="modal-todo-title">{todo.title}</span>
                {todo.time && <span className="modal-todo-time">{todo.time}</span>}
              </li>
            ))}
          </ul>
        )}
        <button className="modal-confirm-btn" onClick={onClose}>
          확인
        </button>
      </div>
    </div>
  );
}
