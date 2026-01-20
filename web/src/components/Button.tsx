import React from 'react';
import { motion } from 'framer-motion';
import './Button.css';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  href?: string;
  className?: string;
  disabled?: boolean;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  href,
  className = '',
  disabled = false
}: ButtonProps) {
  const baseClass = `btn btn-${variant} btn-${size} ${className}`;

  const buttonContent = (
    <motion.button
      className={baseClass}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.button>
  );

  if (href && !disabled) {
    return (
      <a href={href} style={{ textDecoration: 'none' }}>
        {buttonContent}
      </a>
    );
  }

  return buttonContent;
}
