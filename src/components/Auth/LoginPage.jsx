import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../api/auth";
import {
    Container,
    TextField,
    Button,
    Typography,
    Alert,
    Box,
} from "@mui/material";

const LoginPage = () => {
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(formData);
            navigate("/calendar");
        } catch (err) {
            setError("Invalid credentials. Please try again.");
        }
    };

    return (
        <Container maxWidth="xs" sx={{ mt: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Login
            </Typography>
            <Box component="form" onSubmit={handleSubmit}>
                <TextField
                    label="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    fullWidth
                    required
                    margin="normal"
                    variant="outlined"
                />
                <TextField
                    label="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    fullWidth
                    required
                    margin="normal"
                    variant="outlined"
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2 }}
                >
                    Login
                </Button>
            </Box>
            {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                </Alert>
            )}
        </Container>
    );
};

export default LoginPage;
