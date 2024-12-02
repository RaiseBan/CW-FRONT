import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import SearchMeals from "../Search/SearchMeals";

const Header = () => {
    const navigate = useNavigate();
    const username = localStorage.getItem("username");
    const token = localStorage.getItem("token");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        navigate("/login");
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Meal Planner
                </Typography>
                <Button color="inherit" component={NavLink} to="/calendar">
                    Calendar
                </Button>
                <Button color="inherit" component={NavLink} to="/shopping-list">
                    Shopping List
                </Button>
                <Button color="inherit" component={NavLink} to="/favorites">
                    Favorites
                </Button>
                {token ? (
                    <>
                        <Typography variant="body1" sx={{ marginLeft: 2 }}>
                            Welcome, {username}!
                        </Typography>
                        <Box sx={{ marginLeft: 2 }}>
                            <SearchMeals />
                        </Box>
                        <Button color="inherit" onClick={handleLogout}>
                            Logout
                        </Button>
                    </>
                ) : (
                    <>
                        <Button color="inherit" component={NavLink} to="/login">
                            Login
                        </Button>
                        <Button color="inherit" component={NavLink} to="/register">
                            Register
                        </Button>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Header;
