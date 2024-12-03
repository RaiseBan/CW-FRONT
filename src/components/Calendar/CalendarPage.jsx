import React, { useState, useEffect } from "react";
import {
    Typography,
    CircularProgress,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    Select,
} from "@mui/material";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useNavigate } from "react-router-dom";

const localizer = momentLocalizer(moment);

const CalendarPage = () => {
    const [events, setEvents] = useState([]); // События календаря
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false); // Состояние модального окна
    const [selectedEvent, setSelectedEvent] = useState(null); // Выбранное событие
    const [selectedDate, setSelectedDate] = useState(""); // Выбранная дата и время
    const [action, setAction] = useState(""); // Действие: "edit", "view", "delete"
    const navigate = useNavigate();

    // Запрос событий с бэкенда
    const fetchEvents = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/calendar/dishes", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch events");
            }

            const data = await response.json();

            const mappedEvents = data.map((dish) => ({
                id: dish.id, // ID записи в календаре
                originalDishId: dish.originalDishId, // ID оригинального блюда
                title: dish.name,
                start: new Date(dish.dateTime),
                end: new Date(dish.dateTime),
            }));

            setEvents(mappedEvents);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();

        // Обновление каждые 5 секунд
        const interval = setInterval(fetchEvents, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleSelectEvent = (event) => {
        setSelectedEvent(event);
        setSelectedDate(moment(event.start).format("YYYY-MM-DDTHH:mm:ss"));
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
        setSelectedEvent(null);
        setSelectedDate("");
        setAction("");
    };

    const handleActionChange = (e) => {
        setAction(e.target.value);
    };

    const handleViewDish = async () => {
        if (!selectedEvent) return;

        try {
            const response = await fetch(`http://localhost:8080/api/calendar/original-dish/${selectedEvent.id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch original dish ID");
            }

            const originalDishId = await response.json();
            navigate(`/user-dish/${originalDishId}`);
        } catch (err) {
            console.error("Error fetching original dish ID:", err.message);
        }
    };


    const handleSave = async () => {
        if (!selectedEvent || !selectedDate) {
            alert("Please select an event and date!");
            return;
        }

        try {
            const payload = {
                time: selectedDate,
            };

            const updateResponse = await fetch(
                `http://localhost:8080/api/calendar/dish/${selectedEvent.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify(payload),
                }
            );

            if (!updateResponse.ok) {
                throw new Error("Failed to update event");
            }

            alert("Event updated successfully!");
            handleModalClose();
            fetchEvents(); // Обновляем события в календаре
        } catch (err) {
            console.error("Error saving event:", err.message);
            alert("Failed to update event. Please try again.");
        }
    };

    const handleDeleteDish = async () => {
        if (!selectedEvent) {
            alert("Please select an event!");
            return;
        }

        try {
            const deleteResponse = await fetch(
                `http://localhost:8080/api/calendar/remove-dish/${selectedEvent.id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            if (!deleteResponse.ok) {
                throw new Error("Failed to delete event");
            }

            alert("Event deleted successfully!");
            handleModalClose();
            fetchEvents(); // Обновляем события в календаре
        } catch (err) {
            console.error("Error deleting event:", err.message);
            alert("Failed to delete event. Please try again.");
        }
    };

    // Функция для определения стиля события
    const eventStyleGetter = () => {
        return {
            style: {
                backgroundColor: "#9c27b0", // Цвет из вашего скрина
                color: "white",
                border: "none",
                borderRadius: "5px",
                padding: "5px",
            },
        };
    };

    if (isLoading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ textAlign: "center", color: "red", marginTop: "20px" }}>
                <Typography variant="h6">{error}</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ padding: "20px" }}>
            <Typography variant="h4" gutterBottom align="center">
                Calendar
            </Typography>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 600 }}
                onSelectEvent={handleSelectEvent}
                eventPropGetter={eventStyleGetter} // Применяем стиль события
            />
            <Dialog open={modalOpen} onClose={handleModalClose}>
                <DialogTitle>Select Action</DialogTitle>
                <DialogContent>
                    <Select
                        value={action}
                        onChange={handleActionChange}
                        fullWidth
                        displayEmpty
                        sx={{ mb: 2 }}
                    >
                        <MenuItem value="" disabled>
                            Choose an action
                        </MenuItem>
                        <MenuItem value="view">View Dish</MenuItem>
                        <MenuItem value="edit">Change Time</MenuItem>
                        <MenuItem value="delete">Delete Dish</MenuItem>
                    </Select>
                    {action === "edit" && (
                        <TextField
                            label="Date and Time"
                            type="datetime-local"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            fullWidth
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleModalClose} color="secondary">
                        Cancel
                    </Button>
                    {action === "view" && (
                        <Button onClick={handleViewDish} color="primary">
                            View Dish
                        </Button>
                    )}
                    {action === "edit" && (
                        <Button onClick={handleSave} color="primary">
                            Save
                        </Button>
                    )}
                    {action === "delete" && (
                        <Button onClick={handleDeleteDish} color="error">
                            Delete
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default CalendarPage;
