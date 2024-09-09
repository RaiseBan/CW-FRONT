import React from 'react';
import styles from './TaskModal.module.css';
import Button from '../Button';

const TaskModal = ({ newTask, setNewTask, handleCreateTask, handleCloseModal }) => {
    return (
        <div className={styles.modal}>
            <h2>Create Task</h2>
            <input
                type="text"
                placeholder="Title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            />
            <textarea
                placeholder="Description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            />
            <input
                type="date"
                value={newTask.deadline}
                onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
            />
            <div className={styles.buttonGroup}>
                <Button onClick={handleCreateTask}>Done</Button>
                <Button onClick={handleCloseModal}>Cancel</Button>
            </div>
        </div>
    );
};

export default TaskModal;
