import React, { useState, useEffect } from "react";
import { Autocomplete, TextField, CircularProgress, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const SearchMeals = () => {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const backendUrl = "http://localhost:8080/proxy/meals";

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (query.trim().length > 0) {
                fetchMeals(query);
            }
        }, 100);

        return () => clearTimeout(timeout);
    }, [query]);

    const fetchMeals = async (searchTerm) => {
        try {
            setIsLoading(true);
            const response = await fetch(`${backendUrl}?searchTerm=${searchTerm}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const data = await response.json();

            const mealSuggestions = data.meals
                ? data.meals.map((meal) => ({
                    label: meal.strMeal, // Для Autocomplete нужен label
                    id: meal.idMeal,
                }))
                : [];
            setSuggestions(mealSuggestions);
        } catch (error) {
            console.error("Error fetching meals:", error.message);
            setSuggestions([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelect = (event, value) => {
        if (value) {
            navigate(`/meal/${encodeURIComponent(value.label)}`);
        }
    };

    return (
        <Box sx={{ width: "300px" }}>
            <Autocomplete
                freeSolo
                options={suggestions}
                getOptionLabel={(option) => option.label || ""}
                onInputChange={(event, newInputValue) => setQuery(newInputValue)}
                onChange={handleSelect}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Search Meals"
                        variant="outlined"
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <>
                                    {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                </>
                            ),
                        }}
                    />
                )}
            />
        </Box>
    );
};

export default SearchMeals;
