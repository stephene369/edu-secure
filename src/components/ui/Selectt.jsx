// components/ui/Select.jsx
import React from 'react';

// Composant principal Select
export default function Select({ 
  label, 
  error, 
  options = [],
  value,
  onValueChange, // Utilisez onChange à la place
  className = '',
  ...props 
}) {
  const handleChange = (event) => {
    if (onValueChange) {
      onValueChange(event.target.value);
    }
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={handleChange}
        className={`
          w-full px-3 py-2 border border-gray-300 rounded-lg
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          bg-white
          transition-colors duration-200
          ${error ? 'border-red-500 focus:ring-red-500' : ''}
          ${className}
        `}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

// SelectTrigger - Pour afficher la valeur sélectionnée
export function SelectTrigger({ 
  children, 
  className = '',
  ...props 
}) {
  return (
    <button
      type="button"
      className={`
        flex items-center justify-between w-full px-3 py-2 border border-gray-300 rounded-lg
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
        bg-white hover:bg-gray-50
        transition-colors duration-200
        ${className}
      `}
      {...props}
    >
      {children}
      <svg 
        className="w-4 h-4 text-gray-500" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );
}

// SelectValue - Pour afficher la valeur sélectionnée
export function SelectValue({ 
  placeholder = "Sélectionner...", 
  value,
  options = [],
  className = '' 
}) {
  const selectedOption = options.find(opt => opt.value === value);
  
  return (
    <span className={`text-gray-900 ${className}`}>
      {selectedOption ? selectedOption.label : placeholder}
    </span>
  );
}

// SelectContent - Conteneur pour les options
export function SelectContent({ 
  children, 
  className = '',
  isOpen = false,
  ...props 
}) {
  if (!isOpen) return null;
  
  return (
    <div
      className={`
        absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg
        max-h-60 overflow-auto
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

// SelectItem - Option individuelle
export function SelectItem({ 
  value, 
  children, 
  className = '',
  onSelect,
  isSelected = false,
  ...props 
}) {
  return (
    <div
      className={`
        px-3 py-2 cursor-pointer transition-colors duration-200
        hover:bg-gray-100
        ${isSelected ? 'bg-blue-50 text-blue-600' : 'text-gray-900'}
        ${className}
      `}
      onClick={() => onSelect?.(value)}
      {...props}
    >
      {children}
    </div>
  );
}