import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
    Box,
    Typography,
    CircularProgress,
    Button,
    Grid,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Paper,
} from "@mui/material";

const UserDish = () => {
    const { id } = useParams();
    const [dish, setDish] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        instructions: "",
        ingredients: [],
    });

    const fetchDish = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/dishes/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch dish");
            }

            const data = await response.json();
            setDish(data);
            setFormData({
                name: data.name,
                instructions: data.instructions,
                ingredients: data.ingredients.map((ingredient) => ({
                    id: ingredient.id,
                    name: ingredient.name,
                    unit: ingredient.unit,
                })),
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDish();
    }, [id]);

    const handleEditToggle = () => {
        setEditMode((prev) => !prev);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleIngredientChange = (index, field, value) => {
        setFormData((prev) => {
            const updatedIngredients = [...prev.ingredients];
            updatedIngredients[index] = { ...updatedIngredients[index], [field]: value };
            return { ...prev, ingredients: updatedIngredients };
        });
    };

    const handleDeleteIngredient = (index) => {
        setFormData((prev) => ({
            ...prev,
            ingredients: prev.ingredients.filter((_, i) => i !== index),
        }));
    };

    const handleAddIngredient = () => {
        setFormData((prev) => ({
            ...prev,
            ingredients: [...prev.ingredients, { id: null, name: "", unit: "" }],
        }));
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/dishes/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    ...formData,
                    ingredients: formData.ingredients.map((ingredient) => ({
                        id: ingredient.id || null, // Передаем null для новых ингредиентов
                        name: ingredient.name.trim(),
                        unit: ingredient.unit.trim(),
                    })),
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to update dish");
            }

            const updatedDish = await response.json();
            setDish(updatedDish);
            setEditMode(false);
        } catch (err) {
            setError(err.message);
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
            <Paper sx={{ padding: "20px", marginBottom: "20px", border: "2px solid #1976d2" }}>
                <Typography variant="h4" gutterBottom>
                    {dish.name}
                </Typography>
                <Typography variant="h6">Instructions</Typography>
                <Typography>{dish.instructions}</Typography>
            </Paper>

            <Typography variant="h6" sx={{ marginBottom: "10px" }}>
                Ingredients
            </Typography>
            <Grid container spacing={2}>
                {dish.ingredients.map((ingredient, index) => (
                    <Grid item xs={12} key={index}>
                        <Paper
                            sx={{
                                padding: "10px",
                                border: "2px solid #ddd",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <Typography>{`${ingredient.name} - ${ingredient.unit}`}</Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
            <Button variant="contained" color="primary" onClick={handleEditToggle} sx={{ marginTop: "20px" }}>
                Edit Dish
            </Button>

            <Dialog open={editMode} onClose={handleEditToggle} maxWidth="md" fullWidth>
                <DialogTitle>Edit Dish</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        sx={{ marginBottom: "20px" }}
                    />
                    <TextField
                        fullWidth
                        label="Instructions"
                        name="instructions"
                        value={formData.instructions}
                        onChange={handleInputChange}
                        sx={{ marginBottom: "20px" }}
                    />
                    <Typography variant="h6">Ingredients</Typography>
                    {formData.ingredients.map((ingredient, index) => (
                        <Box
                            key={index}
                            sx={{
                                marginBottom: "10px",
                                padding: "10px",
                                border: "2px solid #ddd",
                                borderRadius: "5px",
                            }}
                        >
                            <TextField
                                fullWidth
                                label="Name"
                                value={ingredient.name}
                                onChange={(e) => handleIngredientChange(index, "name", e.target.value)}
                                sx={{ marginBottom: "10px" }}
                            />
                            <TextField
                                fullWidth
                                label="Unit"
                                value={ingredient.unit}
                                onChange={(e) => handleIngredientChange(index, "unit", e.target.value)}
                                sx={{ marginBottom: "10px" }}
                            />
                            <Button
                                variant="outlined"
                                color="error"
                                onClick={() => handleDeleteIngredient(index)}
                                sx={{ marginTop: "10px" }}
                            >
                                Remove Ingredient
                            </Button>
                        </Box>
                    ))}
                    <Button variant="outlined" color="primary" onClick={handleAddIngredient} sx={{ marginTop: "10px" }}>
                        Add Ingredient
                    </Button>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditToggle} color="secondary">
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

export default UserDish;
