// src/components/ShoppingList/ShoppingListPage.jsx
import React from "react";
import styles from "./ShoppingListPage.module.css";

const ShoppingListPage = () => (
    <div className={styles.shoppingList}>
        <h1>Shopping List</h1>
        <ul>
            {/* Заглушка для списка продуктов */}
            <li>Example Product 1 - $10</li>
            <li>Example Product 2 - n/a</li>
        </ul>
    </div>
);

export default ShoppingListPage;
