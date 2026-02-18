import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './Button.css';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  href?: string;
  className?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
}


export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  href,
  className = '',
  disabled = false,
  style
}: ButtonProps) {
  const baseClass = `btn btn-${variant} btn-${size} ${className}`;

  if (href && !disabled) {
    return (
      <Link to={href} className={baseClass} style={style}>
        <motion.span
          initial={false}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        >
          {children}
        </motion.span>
      </Link>
    );
  }

  return (
    <motion.button
      className={baseClass}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      transition={{ duration: 0.2 }}
      style={style}
    >
      {children}
    </motion.button>
  );
}
