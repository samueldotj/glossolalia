import React, { useState, type ReactNode } from 'react';
// Update the CSS import to the new filename
import styles from './QBox.module.css';

// Rename the props type for clarity
type QBoxProps = {
  children: ReactNode;
  title?: string;
  defaultCollapsed?: boolean;
};

// A simple chevron SVG component (this can remain the same)
function Chevron() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 9L12 15L18 9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </svg>
  );
}

// Rename the component function from Box to QBox
export default function QBox({ children, title, defaultCollapsed = false }: QBoxProps): JSX.Element {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={styles.customBox}>
      {title && (
        <div className={styles.customBoxTitle} onClick={handleToggle}>
          <span>{title}</span>
          <span className={`${styles.chevronIcon} ${isCollapsed ? styles.collapsed : ''}`}>
             <Chevron />
          </span>
        </div>
      )}
      {!isCollapsed && (
        <div className={styles.customBoxContent}>
          {children}
        </div>
      )}
    </div>
  );
}