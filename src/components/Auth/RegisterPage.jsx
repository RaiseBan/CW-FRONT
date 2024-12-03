import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../../api/auth";
import {
    Container,
    TextField,
    Button,
    Typography,
    Alert,
    Box,
} from "@mui/material";

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        try {
            await register({
                username: formData.username,
                password: formData.password,
            });
            navigate("/login");
        } catch (err) {
            setError("Failed to register. Please try again.");
        }
    };

    return (
        <Container maxWidth="xs" sx={{ mt: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Register
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
                <TextField
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
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
                    Register
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

export default RegisterPage;
