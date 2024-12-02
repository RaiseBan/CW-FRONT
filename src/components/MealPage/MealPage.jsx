import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    Typography,
    Button,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    CircularProgress,
    Box,
    List,
    ListItem,
    ListItemText,
    Link,
} from "@mui/material";

const MealPage = () => {
    const { name } = useParams();
    const [meal, setMeal] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [imageSrc, setImageSrc] = useState(null);

    useEffect(() => {
        const fetchMeal = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8080/proxy/meals?searchTerm=${encodeURIComponent(name)}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );
                const data = await response.json();
                if (data.meals && data.meals.length > 0) {
                    setMeal(data.meals[0]);
                    fetchImage(data.meals[0].strMealThumb);
                } else {
                    throw new Error("Meal not found");
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMeal();
    }, [name]);

    const fetchImage = async (imageUrl) => {
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
            setImageSrc(URL.createObjectURL(blob));
        } catch (err) {
            console.error(err.message);
            setImageSrc(null);
        }
    };

    const handleAddToFavorites = async () => {
        if (!meal) return;

        const ingredients = [];
        for (let i = 1; i <= 20; i++) {
            const ingredient = meal[`strIngredient${i}`];
            const measure = meal[`strMeasure${i}`];
            if (ingredient && measure) {
                ingredients.push({ name: ingredient, unit: measure });
            }
        }

        const payload = {
            name: meal.strMeal,
            instructions: meal.strInstructions,
            imageUrl: meal.strMealThumb, // Добавляем ссылку на изображение
            ingredients,
        };

        try {
            const response = await fetch("http://localhost:8080/api/dishes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            alert("Dish added to favorites!");
        } catch (err) {
            console.error("Failed to add dish:", err.message);
            alert("Failed to add dish. Please try again.");
        }
    };

    if (isLoading)
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
                <CircularProgress />
            </Box>
        );
    if (error)
        return (
            <Box sx={{ textAlign: "center", color: "red", marginTop: "20px" }}>
                <Typography variant="h6">{error}</Typography>
            </Box>
        );

    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ingredient) {
            ingredients.push(`${ingredient} - ${measure}`);
        }
    }

    return (
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
            <Card sx={{ maxWidth: 600, width: "100%" }}>
                {imageSrc ? (
                    <CardMedia component="img" height="300" image={imageSrc} alt={meal.strMeal} />
                ) : (
                    <Typography variant="body2" sx={{ textAlign: "center", padding: "20px" }}>
                        Image not available
                    </Typography>
                )}
                <CardContent>
                    <Typography variant="h4" component="div" gutterBottom>
                        {meal.strMeal}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" paragraph>
                        {meal.strInstructions}
                    </Typography>
                    {meal.strYoutube && (
                        <Typography variant="body1">
                            Watch on YouTube:{" "}
                            <Link href={meal.strYoutube} target="_blank" rel="noopener noreferrer">
                                {meal.strYoutube}
                            </Link>
                        </Typography>
                    )}
                    <Typography variant="h6" sx={{ marginTop: "20px" }}>
                        Ingredients:
                    </Typography>
                    <List>
                        {ingredients.map((ingredient, index) => (
                            <ListItem key={index}>
                                <ListItemText primary={ingredient} />
                            </ListItem>
                        ))}
                    </List>
                </CardContent>
                <CardActions sx={{ justifyContent: "center" }}>
                    <Button variant="contained" color="primary" onClick={handleAddToFavorites}>
                        Add to Favorites
                    </Button>
                </CardActions>
            </Card>
        </Box>
    );
};

export default MealPage;
