import React from 'react';
import styles from './TaskInfoModal.module.css';

const TaskInfoModal = ({ task, onClose }) => {
    return (
        <div className={styles.modal}>
            <h2 className={styles.title}>{task.title}</h2>
            <p className={styles.description}>{task.description}</p>
            <p className={styles.deadline}>Deadline: {task.deadline}</p>
            <div className={styles.buttonGroup}>
                <button className={styles.closeButton} onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default TaskInfoModal;
