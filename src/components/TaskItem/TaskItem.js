import React, { useState } from 'react';
import styles from './TaskItem.module.css';
import Button from '../Button/Button';
import TaskModal from '../TaskModal/TaskModal'; // Импортируем TaskModal для редактирования

import TaskInfoModal from '../TaskInfoModal/TaskInfoModal'; // Импортируем модальное окно с информацией

const TaskItem = ({ task, onEdit, onDelete, onComplete }) => {
    const [showActions, setShowActions] = useState(false);
    const [isEditing, setIsEditing] = useState(false); // Управляем состоянием редактирования
    const [showInfoModal, setShowInfoModal] = useState(false); // Управляем состоянием для модального окна информации
    const [editedTask, setEditedTask] = useState({ ...task });

    const toggleTaskMenu = () => {
        setShowActions(!showActions);
    };

    const handleSaveTask = () => {
        onEdit(editedTask); // Передаем обновленную задачу в onEdit
        setIsEditing(false); // Закрываем режим редактирования
    };

    return (
        <>
            <div className={styles.taskBlock} onClick={() => setShowInfoModal(true)}>
                <h3 className={styles.taskTitle}>{task.title}</h3>
                <p className={styles.taskDeadline}>Deadline: {task.deadline}</p>
                {task.completed ? <p className={styles.completed}>Completed</p> : null}
                <Button onClick={toggleTaskMenu}>Actions</Button>

                {showActions && !isEditing && (
                    <div className={styles.actions}>
                        <Button onClick={() => setIsEditing(true)}>Edit</Button>
                        <Button onClick={onDelete}>Delete</Button>
                        <Button onClick={onComplete}>Complete</Button>
                    </div>
                )}

                {isEditing && (
                    <TaskModal
                        task={editedTask}
                        setTask={setEditedTask}
                        handleSaveTask={handleSaveTask}
                        handleCloseModal={() => setIsEditing(false)}
                        isEditing={true} // Указываем, что это режим редактирования
                    />
                )}
            </div>

            {showInfoModal && (
                <TaskInfoModal task={task} onClose={() => setShowInfoModal(false)} />
            )}
        </>
    );
};

export default TaskItem;