import React, { useState, useEffect } from "react";
import Button from "../../components/Button";
import Header from "../../components/Header";
import TaskItem from "../../components/TaskItem/TaskItem";
import TaskModal from "../../components/TaskModal/TaskModal"; // Импортируем модальное окно
import { saveTask, deleteTask, patchTask, getAllTasks } from '../../services/taskService';

export default function HomePage() {
    const [tasks, setTasks] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newTask, setNewTask] = useState({ title: "", description: "", deadline: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // При первой загрузке страницы загружаем задачи из localStorage и сервера
    useEffect(() => {
        // Попробуем безопасно считать данные из localStorage
        let savedTasks = [];
        try {
            const tasksFromStorage = localStorage.getItem('tasks');
            if (tasksFromStorage) {
                savedTasks = JSON.parse(tasksFromStorage);
            }
        } catch (error) {
            console.error('Error parsing tasks from localStorage', error);
            // Если ошибка, сбрасываем задачи на пустой массив
            savedTasks = [];
        }
        setTasks(savedTasks);
    
        // Затем обновляем задачи с сервера
        const fetchTasks = async () => {
            setLoading(true);
            try {
                const fetchedTasks = await getAllTasks();
                setTasks(fetchedTasks);
                localStorage.setItem('tasks', JSON.stringify(fetchedTasks));
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
    
        fetchTasks();
    }, []);
    
    

    const handleCreateTask = async () => {
        setLoading(true);
        try {
            const savedTask = await saveTask(newTask);
            const updatedTasks = [...tasks, savedTask];
            setTasks(updatedTasks);
            localStorage.setItem('tasks', JSON.stringify(updatedTasks));
            setShowModal(false);
            setNewTask({ title: "", description: "", deadline: "" });
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTask = async (id) => {
        setLoading(true);
        try {
            await deleteTask(id);
            const updatedTasks = tasks.filter((task) => task.id !== id);
            setTasks(updatedTasks);
            localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCompleteTask = async (id, updates) => {
        setLoading(true);
        try {
            const updatedTask = await patchTask(id, updates);
            const updatedTasks = tasks.map((task) => (task.id === id ? updatedTask : task));
            setTasks(updatedTasks);
            localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Header />
            <Button onClick={() => setShowModal(true)}>Create</Button>

            {/* Показ ошибок */}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* Показ задач */}
            <div>
                {loading ? (
                    <p>Loading tasks...</p>
                ) : (
                    tasks.map((task) => (
                        <TaskItem
                            key={task.id}
                            task={task}
                            onDelete={() => handleDeleteTask(task.id)}
                            onComplete={() => handleCompleteTask(task.id, { completed: true })}
                            onEdit={(updatedTask) => handleCompleteTask(task.id, updatedTask)}
                        />
                    ))
                )}
            </div>

            {/* Модальное окно для создания задачи */}
            {showModal && (
                <TaskModal
                    newTask={newTask}
                    setNewTask={setNewTask}
                    handleCreateTask={handleCreateTask}
                    handleCloseModal={() => setShowModal(false)}
                />
            )}
        </div>
    );
}
