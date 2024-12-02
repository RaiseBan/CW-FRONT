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
} from "@mui/material";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const CalendarPage = () => {
    const [events, setEvents] = useState([]); // События календаря
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false); // Состояние модального окна
    const [selectedEvent, setSelectedEvent] = useState(null); // Выбранное событие
    const [selectedDate, setSelectedDate] = useState(""); // Выбранная дата и время

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
                id: dish.id,
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
    };

    const handleSave = async () => {
        if (!selectedEvent || !selectedDate) {
            alert("Please select an event and date!");
            return;
        }

        try {
            const payload = {
                dishId: selectedEvent.id,
                calendarDate: selectedDate,
            };

            const response = await fetch("http://localhost:8080/api/calendar/add-dish", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error("Failed to save event");
            }

            alert("Event updated successfully!");
            handleModalClose();
            fetchEvents();
        } catch (err) {
            console.error("Error saving event:", err.message);
            alert("Failed to update event. Please try again.");
        }
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
            />
            <Dialog open={modalOpen} onClose={handleModalClose}>
                <DialogTitle>Update Event</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Date and Time"
                        type="datetime-local"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleModalClose} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleSave} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default CalendarPage;
