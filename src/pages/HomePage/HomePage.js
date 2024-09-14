import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { saveTask, getAllTasks } from '../../services/taskService';
import TaskModal from '../../components/TaskModal/TaskModal';
import styles from './HomePage.module.css';
import { useNavigate } from "react-router-dom";
import { verifyToken } from "../../services/authService"

const localizer = momentLocalizer(moment);

export default function HomePage() {
    const [tasks, setTasks] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newTask, setNewTask] = useState({ title: "", start: "", end: "", color: "#ff0000" });
    const navigate = useNavigate();

    useEffect(() => {
        const checkToken = async () => {
            const response = await verifyToken();
            if (!response.ok) {
                navigate("/authentication");
                return;
            }
        };
        checkToken();

        // Получаем задачи с бэкенда и форматируем для календаря
        const fetchTasks = async () => {
            try {
                const fetchedTasks = await getAllTasks();
                const formattedTasks = fetchedTasks.map(task => ({
                    title: task.title,
                    start: new Date(task.startTime),
                    end: new Date(task.endTime),
                    allDay: false,
                    color: task.color
                }));
                setTasks(formattedTasks);
            } catch (error) {
                console.error("Error fetching tasks: ", error);
            }
        };
        fetchTasks();
    }, [navigate]);

    const handleCreateTask = async () => {
        try {
            await saveTask(newTask);
            setShowModal(false);
            setNewTask({ title: "", start: "", end: "", color: "#ff0000" });

            // Обновляем список задач и форматируем их для календаря
            const updatedTasks = await getAllTasks();
            const formattedTasks = updatedTasks.map(task => ({
                title: task.title,
                start: new Date(task.startTime),
                end: new Date(task.endTime),
                allDay: false,
                color: task.color
            }));
            setTasks(formattedTasks);
        } catch (error) {
            console.error("Error saving task: ", error);
        }
    };

    const eventStyleGetter = (event) => {
        const backgroundColor = event.color;
        return {
            style: {
                backgroundColor,
                borderRadius: '5px',
                opacity: 0.8,
                color: 'white',
                border: '0px',
                display: 'block'
            }
        };
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.header}>Task Scheduler</h1>

            {/* Календарь */}
            <div className={styles.calendarContainer}>
            <Calendar
                localizer={localizer}
                events={tasks}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 800 }} // Устанавливаем общую высоту календаря
                step={10} // Длительность временного интервала в минутах (например, 30 минут)
                timeslots={3} // Количество временных интервалов в одном часе (например, 2 по 30 минут)
                eventPropGetter={eventStyleGetter}
            />
            </div>

            <button className={styles.createTaskButton} onClick={() => setShowModal(true)}>+</button>

            {/* Модальное окно для создания задачи */}
            {showModal && (
                <TaskModal
                    task={newTask}
                    setTask={setNewTask}
                    handleSaveTask={handleCreateTask}
                    handleCloseModal={() => setShowModal(false)}
                />
            )}
        </div>
    );
}
