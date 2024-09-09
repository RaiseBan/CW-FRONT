import React from 'react';
import styles from './TaskItem.module.css';
import Button from '../Button';

const TaskItem = ({ task, onEdit, onDelete, onComplete }) => {
    const [showActions, setShowActions] = React.useState(false);

    const toggleTaskMenu = () => {
        setShowActions(!showActions);
    };

    return (
        <div className={styles.taskBlock}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p>Deadline: {task.deadline}</p>
            {task.completed ? <p className={styles.completed}>Completed</p> : null}
            <Button onClick={toggleTaskMenu}>Actions</Button>

            {/* Кнопки для редактирования, удаления и выполнения */}
            {showActions && (
                <div className={styles.actions}>
                    <Button onClick={() => onEdit({ title: "Edited Title", description: task.description })}>Edit</Button>
                    <Button onClick={onDelete}>Delete</Button>
                    <Button onClick={onComplete}>Complete</Button>
                </div>
            )}
        </div>
    );
};

export default TaskItem;
