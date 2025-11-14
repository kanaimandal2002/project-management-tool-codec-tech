import './TaskCard.css';

const TaskCard = ({ task }) => {
  return (
    <div className="task-card">
      <h4>{task.title}</h4>
      {task.assignee && <p className="assignee">👤 {task.assignee.name}</p>}
      <div className="task-footer">
        <span className={`priority-badge ${task.priority}`}>{task.priority}</span>
        {task.dueDate && (
          <span className="due-date">
            📅 {new Date(task.dueDate).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
