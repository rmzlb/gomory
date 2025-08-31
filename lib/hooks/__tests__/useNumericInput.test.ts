import { renderHook, act } from '@testing-library/react'

import { useNumericInput } from '../useNumericInput'

describe('useNumericInput', () => {
  it('should initialize with the provided value', () => {
    const { result } = renderHook(() => useNumericInput(42))
    expect(result.current.value).toBe('42')
    expect(result.current.isValid).toBe(true)
  })

  it('should handle empty string when allowEmpty is true', () => {
    const { result } = renderHook(() =>
      useNumericInput(10, { allowEmpty: true })
    )

    act(() => {
      result.current.handleChange('')
    })

    expect(result.current.value).toBe('')
    expect(result.current.isValid).toBe(true)
  })

  it('should reject non-numeric input', () => {
    const { result } = renderHook(() => useNumericInput(10))

    act(() => {
      result.current.handleChange('abc')
    })

    // Should not change value for invalid input
    expect(result.current.value).toBe('10')
  })

  it('should accept decimal numbers', () => {
    const { result } = renderHook(() => useNumericInput(10))

    act(() => {
      result.current.handleChange('10.5')
    })

    expect(result.current.value).toBe('10.5')
    expect(result.current.isValid).toBe(true)
  })

  it('should clamp value to min on blur', () => {
    const onChange = jest.fn()
    const { result } = renderHook(() =>
      useNumericInput(10, { min: 5, onChange })
    )

    act(() => {
      result.current.handleChange('2')
    })

    act(() => {
      result.current.handleBlur()
    })

    expect(result.current.value).toBe('5')
    expect(onChange).toHaveBeenCalledWith(5)
  })

  it('should clamp value to max on blur', () => {
    const onChange = jest.fn()
    const { result } = renderHook(() =>
      useNumericInput(10, { max: 20, onChange })
    )

    act(() => {
      result.current.handleChange('25')
    })

    act(() => {
      result.current.handleBlur()
    })

    expect(result.current.value).toBe('20')
    expect(onChange).toHaveBeenCalledWith(20)
  })

  it('should use default value on blur when empty', () => {
    const onChange = jest.fn()
    const { result } = renderHook(() =>
      useNumericInput(10, { defaultValue: 5, allowEmpty: true, onChange })
    )

    act(() => {
      result.current.handleChange('')
    })

    act(() => {
      result.current.handleBlur()
    })

    expect(result.current.value).toBe('5')
    expect(onChange).toHaveBeenCalledWith(5)
  })

  it('should reset to initial value', () => {
    const { result } = renderHook(() => useNumericInput(42))

    act(() => {
      result.current.handleChange('100')
    })

    expect(result.current.value).toBe('100')

    act(() => {
      result.current.reset()
    })

    expect(result.current.value).toBe('42')
    expect(result.current.isValid).toBe(true)
  })

  it('should force a value within bounds', () => {
    const onChange = jest.fn()
    const { result } = renderHook(() =>
      useNumericInput(10, { min: 0, max: 100, onChange })
    )

    act(() => {
      result.current.forceValue(150)
    })

    expect(result.current.value).toBe('100')
    expect(onChange).toHaveBeenCalledWith(100)

    act(() => {
      result.current.forceValue(-10)
    })

    expect(result.current.value).toBe('0')
    expect(onChange).toHaveBeenCalledWith(0)
  })

  it('should provide correct input props', () => {
    const { result } = renderHook(() => useNumericInput(42))

    expect(result.current.inputProps).toMatchObject({
      type: 'text',
      inputMode: 'numeric',
      pattern: '[0-9]*',
      value: '42',
      'aria-invalid': false,
    })

    expect(typeof result.current.inputProps.onChange).toBe('function')
    expect(typeof result.current.inputProps.onBlur).toBe('function')
  })
})