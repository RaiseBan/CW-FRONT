import React, { useState } from 'react';
import styles from './TaskModal.module.css';
import Button from '../Button/Button';

const TaskModal = ({ task, setTask, handleSaveTask, handleCloseModal }) => {
    const [startTime, setStartTime] = useState(task.startTime || '');
    const [endTime, setEndTime] = useState(task.endTime || '');
    const [color, setColor] = useState(task.color || "#ff0000"); // Дефолтный цвет

    // Обработка изменений времени и даты
    const handleTimeChange = (start, end) => {
        setTask({ ...task, startTime: start, endTime: end });
    };

    return (
        <div className={styles.modal}>
            <h2>{task.id ? 'Edit Task' : 'Create Task'}</h2>
            <input
                type="text"
                placeholder="Title"
                value={task.title}
                onChange={(e) => setTask({ ...task, title: e.target.value })}
            />
            <input
                type="datetime-local"
                placeholder="Start Time"
                value={startTime}
                onChange={(e) => {
                    setStartTime(e.target.value);
                    handleTimeChange(e.target.value, endTime);
                }}
            />
            <input
                type="datetime-local"
                placeholder="End Time"
                value={endTime}
                onChange={(e) => {
                    setEndTime(e.target.value);
                    handleTimeChange(startTime, e.target.value);
                }}
            />
            <label>Pick a color:</label>
            <input
                type="color"
                value={color}
                onChange={(e) => {
                    setColor(e.target.value);
                    setTask({ ...task, color: e.target.value });
                }}
            />
            <div className={styles.buttonGroup}>
                <Button onClick={handleSaveTask}>Save</Button>
                <Button onClick={handleCloseModal}>Cancel</Button>
            </div>
        </div>
    );
};

export default TaskModal;
