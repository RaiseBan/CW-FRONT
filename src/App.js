import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header/Header";
import CalendarPage from "./components/Calendar/CalendarPage";
import FavoritesPage from "./components/Favorites/FavoritesPage";
import ShoppingListPage from "./components/ShoppingList/ShoppingListPage";
import LoginPage from "./components/Auth/LoginPage";
import RegisterPage from "./components/Auth/RegisterPage";
import ProtectedRoute from "./components/ProtectedRoute";
import MealPage from "./components/MealPage/MealPage"; // Новый компонент для отображения блюда
import styles from "./App.module.css";

const App = () => (
    <Router>
        <div className={styles.app}>
            <Header />
            <Routes>
                {/* Защищённые маршруты */}
                <Route path="/calendar" element={<ProtectedRoute><CalendarPage /></ProtectedRoute>} />
                <Route path="/shopping-list" element={<ProtectedRoute><ShoppingListPage /></ProtectedRoute>} />
                <Route path="/favorites" element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />

                {/* Открытые маршруты */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Маршрут для отображения блюда */}
                <Route path="/meal/:name" element={<MealPage />} />


                {/* Редирект на календарь для всех неизвестных маршрутов */}
                <Route path="*" element={<Navigate to="/calendar" />} />
            </Routes>
        </div>
    </Router>
);

export default App;
