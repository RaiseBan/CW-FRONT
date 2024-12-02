import React, { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    Grid,
    CircularProgress,
    Button,
    Box,
    Modal,
    TextField,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InfoIcon from "@mui/icons-material/Info";

const FavoritesPage = () => {
    const [favorites, setFavorites] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hoveredDishId, setHoveredDishId] = useState(null);
    const [addedDishIds, setAddedDishIds] = useState(new Set());
    const [imageUrls, setImageUrls] = useState({});
    const [openModal, setOpenModal] = useState(false);
    const [selectedDishId, setSelectedDishId] = useState(null);
    const [selectedDate, setSelectedDate] = useState("");

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/dishes", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch favorites");
                }

                const data = await response.json();
                setFavorites(data);

                // Загружаем изображения для всех блюд
                for (const dish of data) {
                    fetchImage(dish.imageUrl, dish.id);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFavorites();

        // Автоматическое обновление каждые 5 секунд
        const interval = setInterval(fetchFavorites, 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchImage = async (imageUrl, dishId) => {
        try {
            const response = await fetch(
                `http://localhost:8080/proxy/image?url=${encodeURIComponent(imageUrl)}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch image");
            }

            const blob = await response.blob();
            setImageUrls((prev) => ({
                ...prev,
                [dishId]: URL.createObjectURL(blob),
            }));
        } catch (err) {
            console.error("Error fetching image:", err.message);
        }
    };

    const handleAdd = (dishId) => {
        setSelectedDishId(dishId);
        setOpenModal(true);
    };

    const handleInfo = (dishName) => {
        window.location.href = `/meal/${encodeURIComponent(dishName)}`;
    };

    const handleSubmit = async () => {
        if (!selectedDishId || !selectedDate) {
            alert("Please select a date and time.");
            return;
        }

        try {
            // Преобразуем введенное время без миллисекунд
            const date = new Date(selectedDate);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            const hours = String(date.getHours()).padStart(2, "0");
            const minutes = String(date.getMinutes()).padStart(2, "0");
            const seconds = String(date.getSeconds()).padStart(2, "0");

            const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;

            const payload = {
                dishId: selectedDishId,
                calendarDate: formattedDate,
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
                throw new Error(`Failed to add dish to calendar: ${response.status}`);
            }

            setAddedDishIds((prev) => new Set(prev).add(selectedDishId));
            setOpenModal(false);
            alert("Dish added to calendar!");
        } catch (err) {
            console.error("Error adding dish to calendar:", err.message);
        }
    };







    if (isLoading) {
        return <CircularProgress style={{ display: "block", margin: "20px auto" }} />;
    }

    if (error) {
        return <Typography color="error" align="center">{error}</Typography>;
    }

    return (
        <div>
            <Typography variant="h4" gutterBottom align="center">
                Your Favorites
            </Typography>
            <Grid container spacing={2}>
                {favorites.map((dish) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={dish.id}>
                        <Card
                            onMouseEnter={() => setHoveredDishId(dish.id)}
                            onMouseLeave={() => setHoveredDishId(null)}
                            sx={{
                                position: "relative",
                                backgroundColor: addedDishIds.has(dish.id)
                                    ? "rgba(76, 175, 80, 0.1)"
                                    : hoveredDishId === dish.id
                                        ? "rgba(0, 0, 0, 0.05)"
                                        : "white",
                                transition: "background-color 0.3s",
                                boxShadow: addedDishIds.has(dish.id) ? "0px 0px 10px rgba(76, 175, 80, 0.5)" : "",
                            }}
                        >
                            <CardMedia
                                component="img"
                                height="140"
                                image={imageUrls[dish.id] || ""}
                                alt={dish.name}
                                sx={{ objectFit: "cover" }}
                            />
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    {dish.name}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {dish.instructions.slice(0, 100)}...
                                </Typography>
                            </CardContent>
                            <Box
                                sx={{
                                    position: "absolute",
                                    bottom: 10,
                                    left: "50%",
                                    transform: "translateX(-50%)",
                                    display: "flex",
                                    gap: 1,
                                }}
                            >
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    onClick={() => handleAdd(dish.id)}
                                >
                                    Add
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    size="small"
                                    onClick={() => handleInfo(dish.name)}
                                    startIcon={<InfoIcon />}
                                >
                                    Info
                                </Button>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Modal
                open={openModal}
                onClose={() => setOpenModal(false)}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 400,
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                    }}
                >
                    <Typography id="modal-title" variant="h6" component="h2">
                        Select Date and Time
                    </Typography>
                    <TextField
                        type="datetime-local"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        fullWidth
                        sx={{ mt: 2 }}
                    />
                    <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                        >
                            Save
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
};

export default FavoritesPage;
