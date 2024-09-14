const API_URL = 'http://localhost:8080/api/v1/tasks';

// Получение задачи по ID
export const getTaskById = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
    });
    
    const data = await response.json();
    if (response.ok) {
        return data;
    } else {
        throw new Error(data.message || 'Can not get task successfully');
    }
};

// Получение всех задач
export const getAllTasks = async () => {
    const response = await fetch(`${API_URL}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
    });

    const data = await response.json();
    if (response.ok) {
        return data;
    } else {
        throw new Error(data.message || 'Failed to fetch tasks');
    }
};

// Сохранение новой задачи
export const saveTask = async (task) => {
    const response = await fetch(`${API_URL}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(task)
    });

    const data = await response.json();
    console.log(response.status)
    if (response.status === 201) {
        console.log(data);
        return data;
    } else {
        throw new Error(response.message || 'Failed while saving task');
    }
};

// Удаление задачи
export const deleteTask = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
    });

    if (response.status !== 204) {
        throw new Error(response.message || 'Nothing to delete');
    }
};

// Обновление задачи
export const patchTask = async (id, updates) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(updates)
    });

    const data = await response.json();
    if (response.ok) {
        return data;
    } else {
        throw new Error(response.message || "Can not patch the task");
    }
};
