import { useState, useCallback, useEffect } from 'react'

interface UseNumericInputOptions {
  min?: number
  max?: number
  defaultValue?: number
  allowEmpty?: boolean
  onChange?: (value: number) => void
}

/**
 * Custom hook for managing numeric input state with validation
 * Handles empty states during editing and validates on blur
 */
export function useNumericInput(
  initialValue: number,
  options: UseNumericInputOptions = {}
) {
  const {
    min = 0,
    max = Number.MAX_SAFE_INTEGER,
    defaultValue = min,
    allowEmpty = true,
    onChange,
  } = options

  const [value, setValue] = useState(initialValue.toString())
  const [isValid, setIsValid] = useState(true)

  // Update local state when prop changes
  useEffect(() => {
    setValue(initialValue.toString())
  }, [initialValue])

  const handleChange = useCallback((newValue: string) => {
    // Allow empty string during editing
    if (allowEmpty && newValue === '') {
      setValue('')
      setIsValid(true)
      return
    }

    // Allow valid numeric input
    if (/^\d*\.?\d*$/.test(newValue)) {
      setValue(newValue)
      setIsValid(true)
    }
  }, [allowEmpty])

  const handleBlur = useCallback(() => {
    let numValue = parseFloat(value)
    
    // Handle empty or invalid input
    if (value === '' || isNaN(numValue)) {
      numValue = defaultValue
      setValue(defaultValue.toString())
    }
    
    // Clamp to min/max
    if (numValue < min) {
      numValue = min
      setValue(min.toString())
    } else if (numValue > max) {
      numValue = max
      setValue(max.toString())
    }
    
    // Notify parent of valid change
    if (onChange && numValue !== initialValue) {
      onChange(numValue)
    }
    
    setIsValid(true)
  }, [value, min, max, defaultValue, initialValue, onChange])

  const reset = useCallback(() => {
    setValue(initialValue.toString())
    setIsValid(true)
  }, [initialValue])

  const forceValue = useCallback((newValue: number) => {
    const clampedValue = Math.max(min, Math.min(max, newValue))
    setValue(clampedValue.toString())
    if (onChange) {
      onChange(clampedValue)
    }
  }, [min, max, onChange])

  return {
    value,
    isValid,
    handleChange,
    handleBlur,
    reset,
    forceValue,
    inputProps: {
      type: 'text' as const,
      inputMode: 'numeric' as const,
      pattern: '[0-9]*',
      value,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => handleChange(e.target.value),
      onBlur: handleBlur,
      className: isValid ? '' : 'border-red-500',
      'aria-invalid': !isValid,
    },
  }
}