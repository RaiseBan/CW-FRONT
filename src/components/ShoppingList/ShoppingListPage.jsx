import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    CircularProgress,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Grid,
    Divider,
    Paper,
    Button,
} from "@mui/material";

const ShoppingListPage = () => {
    const [shoppingList, setShoppingList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalPrice, setTotalPrice] = useState(0);

    // Параметры фильтрации и сортировки
    const [sortBy, setSortBy] = useState("price");
    const [groupByDish, setGroupByDish] = useState(false);
    const [sortOrder, setSortOrder] = useState("ASC");

    const fetchShoppingList = async () => {
        try {
            const response = await fetch(
                `http://localhost:8080/api/calendar/shopping-list?sortBy=${sortBy}&groupByDish=${groupByDish}&sortOrder=${sortOrder}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch shopping list");
            }

            const data = await response.json();
            setShoppingList(data);

            // Рассчитываем общую стоимость
            const total = data.reduce(
                (acc, item) => (item.available ? acc : acc + (item.price || 0)),
                0
            );
            setTotalPrice(total);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const updateIngredientAvailability = async (ingredientId, available) => {
        if (!ingredientId) {
            console.error("Ingredient ID is null or undefined. Cannot update availability.");
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:8080/api/ingredients/${ingredientId}/availability?available=${available}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to update ingredient availability");
            }

            console.log(`Ingredient ID ${ingredientId} availability updated to ${available}`);
            fetchShoppingList(); // Обновляем список после изменения
        } catch (err) {
            console.error("Error updating ingredient availability:", err.message);
        }
    };


    useEffect(() => {
        fetchShoppingList();

        // Автоматическое обновление каждые 5 секунд
        const interval = setInterval(fetchShoppingList, 5000);
        return () => clearInterval(interval);
    }, [sortBy, groupByDish, sortOrder]);

    const handleSortChange = (e) => {
        setSortBy(e.target.value);
    };

    const handleGroupByChange = (e) => {
        setGroupByDish(e.target.value === "true");
    };

    const handleSortOrderChange = (e) => {
        setSortOrder(e.target.value);
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
                Shopping List
            </Typography>

            {/* Панель фильтров */}
            <Grid
                container
                spacing={2}
                justifyContent="center"
                alignItems="center"
                sx={{ marginBottom: "20px" }}
            >
                <Grid item>
                    <FormControl>
                        <InputLabel>Sort By</InputLabel>
                        <Select value={sortBy} onChange={handleSortChange}>
                            <MenuItem value="price">Price</MenuItem>
                            <MenuItem value="name">Name</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item>
                    <FormControl>
                        <InputLabel>Group By Dish</InputLabel>
                        <Select
                            value={String(groupByDish)}
                            onChange={handleGroupByChange}
                        >
                            <MenuItem value="true">Yes</MenuItem>
                            <MenuItem value="false">No</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item>
                    <FormControl>
                        <InputLabel>Sort Order</InputLabel>
                        <Select value={sortOrder} onChange={handleSortOrderChange}>
                            <MenuItem value="ASC">Ascending</MenuItem>
                            <MenuItem value="DESC">Descending</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            {/* Общая стоимость */}
            <Paper
                sx={{
                    padding: "10px",
                    marginBottom: "20px",
                    textAlign: "center",
                    border: "2px solid #1976d2",
                }}
            >
                <Typography variant="h5" color="primary">
                    Total Price: {totalPrice.toFixed(2)} ₽
                </Typography>
            </Paper>

            {/* Список покупок */}
            <Grid container spacing={2}>
                {groupByDish
                    ? Object.entries(
                        shoppingList.reduce((grouped, item) => {
                            const dishName = item.dishName || "Ungrouped";
                            if (!grouped[dishName]) grouped[dishName] = [];
                            grouped[dishName].push(item);
                            return grouped;
                        }, {})
                    ).map(([dishName, items]) => (
                        <Grid item xs={12} key={dishName}>
                            <Typography
                                variant="h5"
                                sx={{
                                    marginBottom: "10px",
                                    color: "#1976d2",
                                }}
                            >
                                {dishName}
                            </Typography>
                            {items.map((ingredient, index) => (
                                <Box
                                    key={ingredient.ingredientId}
                                    sx={{
                                        padding: "10px",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        backgroundColor: ingredient.available
                                            ? "#e0f7fa"
                                            : "#ffebee",
                                        borderBottom:
                                            index < items.length - 1
                                                ? "1px solid #ddd"
                                                : "none",
                                    }}
                                >
                                    <Typography variant="h6">
                                        {ingredient.ingredientName} -{" "}
                                        {ingredient.count}
                                    </Typography>
                                    <Typography color="text.secondary">
                                        Price:{" "}
                                        {ingredient.price
                                            ? `${ingredient.price.toFixed(
                                                2
                                            )} ₽`
                                            : "n/a"}
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        color={ingredient.available ? "success" : "error"}
                                        onClick={() => {
                                            if (ingredient.ingredientId) {
                                                updateIngredientAvailability(ingredient.ingredientId, !ingredient.available);
                                            } else {
                                                console.warn("Ingredient ID is not defined for this ingredient:", ingredient);
                                            }
                                        }}
                                    >
                                        {ingredient.available ? "Available" : "Unavailable"}
                                    </Button>
                                </Box>
                            ))}
                        </Grid>
                    ))
                    : shoppingList.map((ingredient, index) => (
                        <Grid item xs={12} key={ingredient.ingredientId}>
                            <Box
                                sx={{
                                    padding: "10px",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    backgroundColor: ingredient.available
                                        ? "#e0f7fa"
                                        : "#ffebee",
                                    borderBottom:
                                        index < shoppingList.length - 1
                                            ? "1px solid #ddd"
                                            : "none",
                                }}
                            >
                                <Typography variant="h6">
                                    {ingredient.ingredientName} -{" "}
                                    {ingredient.count}
                                </Typography>
                                <Typography color="text.secondary">
                                    Price:{" "}
                                    {ingredient.price
                                        ? `${ingredient.price.toFixed(2)} ₽`
                                        : "n/a"}
                                </Typography>
                                <Button
                                    variant="contained"
                                    color={
                                        ingredient.available
                                            ? "success"
                                            : "error"
                                    }
                                    onClick={() =>
                                        updateIngredientAvailability(
                                            ingredient.ingredientId,
                                            !ingredient.available
                                        )
                                    }
                                >
                                    {ingredient.available
                                        ? "Available"
                                        : "Unavailable"}
                                </Button>
                            </Box>
                        </Grid>
                    ))}
            </Grid>
        </Box>
    );
};

export default ShoppingListPage;
