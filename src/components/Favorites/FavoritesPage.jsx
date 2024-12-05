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
    Snackbar,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";  // Импортируем useNavigate

const FavoritesPage = () => {
    const [favorites, setFavorites] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hoveredDishId, setHoveredDishId] = useState(null);
    const [imageUrls, setImageUrls] = useState({});
    const [openModal, setOpenModal] = useState(false);
    const [selectedDishId, setSelectedDishId] = useState(null);
    const [selectedDate, setSelectedDate] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    // Состояние для создания нового блюда
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        instructions: "",
        ingredients: [{ name: "", unit: "" }],
    });

    const navigate = useNavigate();

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
        const interval = setInterval(fetchFavorites, 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchImage = async (imageUrl, dishId) => {
        try {
            const finalImageUrl = imageUrl || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRo0muGn3Vb87JEQPpoNriMrWSi1hQ9h8Yr2A&s";

            const response = await fetch(
                `http://localhost:8080/proxy/image?url=${encodeURIComponent(finalImageUrl)}`,
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

    const handleInfo = (dishId) => {
        navigate(`/user-dish/${dishId}`);
    };

    const handleDelete = async (dishId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/dishes/${dishId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to delete dish: ${response.status}`);
            }

            setFavorites((prevFavorites) =>
                prevFavorites.filter((dish) => dish.id !== dishId)
            );
        } catch (err) {
            console.error("Error deleting dish:", err.message);
        }
    };

    const handleSubmit = async () => {
        if (!selectedDishId || !selectedDate) {
            alert("Please select a date and time.");
            return;
        }

        try {
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

            setSnackbarOpen(true);
            setOpenModal(false);
        } catch (err) {
            console.error("Error adding dish to calendar:", err.message);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    // Обработчики для модального окна создания нового блюда
    const handleCreateToggle = () => setOpenCreateModal(!openCreateModal);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleIngredientChange = (index, field, value) => {
        const updatedIngredients = [...formData.ingredients];
        updatedIngredients[index][field] = value;
        setFormData((prev) => ({ ...prev, ingredients: updatedIngredients }));
    };

    const handleAddIngredient = () => {
        setFormData((prev) => ({
            ...prev,
            ingredients: [...prev.ingredients, { name: "", unit: "" }],
        }));
    };

    const handleDeleteIngredient = (index) => {
        const updatedIngredients = formData.ingredients.filter((_, i) => i !== index);
        setFormData((prev) => ({ ...prev, ingredients: updatedIngredients }));
    };

    const handleCreateDish = async () => {
        // Валидация: Проверка на пустые обязательные поля
        if (!formData.name.trim() || !formData.instructions.trim()) {
            alert("Dish name and instructions are required!");
            return;  // Останавливаем выполнение функции, если поля пустые
        }

        try {
            const response = await fetch("http://localhost:8080/api/dishes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error("Failed to create dish");
            }

            setOpenCreateModal(false);
            setSnackbarOpen(true);
            setFormData({
                name: "",
                instructions: "",
                ingredients: [{ name: "", unit: "" }],
            });
        } catch (err) {
            console.error("Error creating dish:", err.message);
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

            <Button
                variant="contained"
                color="primary"
                onClick={handleCreateToggle}
                sx={{ marginBottom: "20px" }}
            >
                Create New Dish
            </Button>

            <Grid container spacing={2}>
                {favorites.map((dish) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={dish.id}>
                        <Card
                            onMouseEnter={() => setHoveredDishId(dish.id)}
                            onMouseLeave={() => setHoveredDishId(null)}
                            sx={{
                                position: "relative",
                                transition: "transform 0.3s, box-shadow 0.3s",
                                transform: hoveredDishId === dish.id ? "scale(0.95)" : "scale(1)",
                                boxShadow: hoveredDishId === dish.id ? "0px 4px 20px rgba(0, 0, 0, 0.2)" : "none",
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
                            {hoveredDishId === dish.id && (
                                <Box
                                    sx={{
                                        position: "absolute",
                                        bottom: 10,
                                        left: "50%",
                                        transform: "translateX(-50%)",
                                        display: "flex",
                                        justifyContent: "space-around",
                                        width: "100%",
                                    }}
                                >
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        size="small"
                                        onClick={() => handleInfo(dish.id)}
                                    >
                                        <InfoIcon />
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        size="small"
                                        onClick={() => handleDelete(dish.id)}
                                    >
                                        <DeleteIcon />
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        size="small"
                                        onClick={() => handleAdd(dish.id)}
                                    >
                                        Add to Calendar
                                    </Button>
                                </Box>
                            )}
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Модальное окно добавления блюда в календарь */}
            <Modal
                open={openModal}
                onClose={() => setOpenModal(false)}
                aria-labelledby="add-dish-modal"
                aria-describedby="add-dish-to-calendar"
            >
                <Box sx={{ display: "flex", flexDirection: "column", p: 2, backgroundColor: "white", borderRadius: 2, maxWidth: 400, margin: "auto", marginTop: "100px" }}>
                    <TextField
                        label="Select Date and Time"
                        type="datetime-local"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        fullWidth
                        InputLabelProps={{
                            shrink: true,
                        }}
                        sx={{ marginBottom: 2 }}
                    />
                    <Button variant="contained" color="primary" fullWidth onClick={handleSubmit}>
                        Add to Calendar
                    </Button>
                </Box>
            </Modal>

            {/* Модальное окно для создания нового блюда */}
            <Dialog open={openCreateModal} onClose={handleCreateToggle}>
                <DialogTitle>Create New Dish</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Dish Name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        fullWidth
                        sx={{ marginBottom: 2 }}
                    />
                    <TextField
                        label="Instructions"
                        name="instructions"
                        value={formData.instructions}
                        onChange={handleInputChange}
                        fullWidth
                        multiline
                        rows={4}
                        sx={{ marginBottom: 2 }}
                    />
                    {formData.ingredients.map((ingredient, index) => (
                        <Box key={index} sx={{ display: "flex", gap: 1, marginBottom: 1 }}>
                            <TextField
                                label="Ingredient"
                                name="name"
                                value={ingredient.name}
                                onChange={(e) => handleIngredientChange(index, "name", e.target.value)}
                                fullWidth
                            />
                            <TextField
                                label="Unit"
                                name="unit"
                                value={ingredient.unit}
                                onChange={(e) => handleIngredientChange(index, "unit", e.target.value)}
                                fullWidth
                            />
                            <Button onClick={() => handleDeleteIngredient(index)}>Delete</Button>
                        </Box>
                    ))}
                    <Button onClick={handleAddIngredient}>Add Ingredient</Button>
                    <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
                        <Button variant="contained" color="primary" onClick={handleCreateDish}>
                            Create Dish
                        </Button>
                        <Button variant="outlined" onClick={handleCreateToggle}>Cancel</Button>
                    </Box>
                </DialogContent>
            </Dialog>

            {/* Snackbar для уведомления о успешном добавлении */}
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: "100%" }}>
                    Dish added to calendar successfully!
                </Alert>
            </Snackbar>
        </div>
    );
};

export default FavoritesPage;
