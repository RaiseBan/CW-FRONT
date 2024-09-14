import React from 'react';
import styles from './Button.module.css';

export default function Button({ children, onClick, disabled = false }) {
  return (
    <button onClick={onClick} className={styles.button} disabled={disabled}>
      {children}
    </button>
  );
}
