import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import * as taskService from '../services/taskService';
import TaskCard from './TaskCard';
import './KanbanBoard.css';

const KanbanBoard = ({ projectId, tasks, onTaskUpdate }) => {
  const [columns, setColumns] = useState({
    todo: { title: 'To Do', tasks: [] },
    'in-progress': { title: 'In Progress', tasks: [] },
    review: { title: 'Review', tasks: [] },
    done: { title: 'Done', tasks: [] },
  });

  useEffect(() => {
    const newColumns = {
      todo: { title: 'To Do', tasks: [] },
      'in-progress': { title: 'In Progress', tasks: [] },
      review: { title: 'Review', tasks: [] },
      done: { title: 'Done', tasks: [] },
    };

    tasks.forEach((task) => {
      if (newColumns[task.status]) {
        newColumns[task.status].tasks.push(task);
      }
    });

    setColumns(newColumns);
  }, [tasks]);

  const handleDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    const newColumns = { ...columns };
    const sourceColumn = newColumns[source.droppableId];
    const destColumn = newColumns[destination.droppableId];

    const [movedTask] = sourceColumn.tasks.splice(source.index, 1);
    destColumn.tasks.splice(destination.index, 0, movedTask);

    setColumns(newColumns);

    try {
      await taskService.updateTaskStatus(draggableId, destination.droppableId);
      onTaskUpdate();
    } catch (error) {
      console.error('Error updating task status:', error);
      setColumns(columns);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="kanban-board">
        {Object.entries(columns).map(([columnId, column]) => (
          <div key={columnId} className="kanban-column">
            <h3 className="column-title">{column.title}</h3>
            <Droppable droppableId={columnId}>
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`droppable-area ${snapshot.isDraggingOver ? 'dragging' : ''}`}
                >
                  {column.tasks.map((task, index) => (
                    <Draggable key={task._id} draggableId={task._id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`draggable-item ${snapshot.isDragging ? 'dragging' : ''}`}
                        >
                          <TaskCard task={task} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;
