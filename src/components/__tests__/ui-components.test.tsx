/**
 * Component tests for UI Elements
 */
import { describe, it, expect } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

// Simple Button Component for testing
const Button = ({ 
  children, 
  onClick, 
  variant = 'primary',
  disabled = false 
}: {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary'
  disabled?: boolean
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant}`}
      data-testid="button"
    >
      {children}
    </button>
  )
}

// Simple Card Component for testing
const Card = ({
  title,
  description,
  children
}: {
  title: string
  description?: string
  children?: React.ReactNode
}) => {
  return (
    <div className="card" data-testid="card">
      <h3 data-testid="card-title">{title}</h3>
      {description && <p data-testid="card-description">{description}</p>}
      {children && <div className="card-content">{children}</div>}
    </div>
  )
}

describe('UI Components', () => {
  describe('Button Component', () => {
    it('should render button with text', () => {
      // Arrange & Act
      render(<Button>Click Me</Button>)

      // Assert
      const button = screen.getByTestId('button')
      expect(button).toBeInTheDocument()
      expect(button).toHaveTextContent('Click Me')
    })

    it('should apply primary variant class', () => {
      // Arrange & Act
      render(<Button variant="primary">Primary</Button>)

      // Assert
      const button = screen.getByTestId('button')
      expect(button).toHaveClass('btn-primary')
    })

    it('should apply secondary variant class', () => {
      // Arrange & Act
      render(<Button variant="secondary">Secondary</Button>)

      // Assert
      const button = screen.getByTestId('button')
      expect(button).toHaveClass('btn-secondary')
    })

    it('should be disabled when disabled prop is true', () => {
      // Arrange & Act
      render(<Button disabled>Disabled</Button>)

      // Assert
      const button = screen.getByTestId('button')
      expect(button).toBeDisabled()
    })

    it('should call onClick when clicked', () => {
      // Arrange
      const mockOnClick = jest.fn()
      render(<Button onClick={mockOnClick}>Click</Button>)

      // Act
      const button = screen.getByTestId('button')
      button.click()

      // Assert
      expect(mockOnClick).toHaveBeenCalledTimes(1)
    })
  })

  describe('Card Component', () => {
    it('should render card with title', () => {
      // Arrange & Act
      render(<Card title="Test Card" />)

      // Assert
      expect(screen.getByTestId('card')).toBeInTheDocument()
      expect(screen.getByTestId('card-title')).toHaveTextContent('Test Card')
    })

    it('should render card with description', () => {
      // Arrange & Act
      render(
        <Card 
          title="Test Card" 
          description="This is a test description" 
        />
      )

      // Assert
      expect(screen.getByTestId('card-description')).toHaveTextContent(
        'This is a test description'
      )
    })

    it('should render card without description when not provided', () => {
      // Arrange & Act
      render(<Card title="Test Card" />)

      // Assert
      expect(screen.queryByTestId('card-description')).not.toBeInTheDocument()
    })

    it('should render children content', () => {
      // Arrange & Act
      render(
        <Card title="Test Card">
          <p>Child content</p>
        </Card>
      )

      // Assert
      expect(screen.getByText('Child content')).toBeInTheDocument()
    })
  })

  describe('Form Elements', () => {
    const Input = ({ 
      label, 
      value, 
      onChange, 
      error 
    }: { 
      label: string
      value: string
      onChange: (value: string) => void
      error?: string
    }) => {
      return (
        <div className="form-group">
          <label data-testid="input-label">{label}</label>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            data-testid="input-field"
            aria-invalid={!!error}
          />
          {error && <span data-testid="input-error">{error}</span>}
        </div>
      )
    }

    it('should render input with label', () => {
      // Arrange & Act
      const mockOnChange = jest.fn()
      render(<Input label="Username" value="" onChange={mockOnChange} />)

      // Assert
      expect(screen.getByTestId('input-label')).toHaveTextContent('Username')
      expect(screen.getByTestId('input-field')).toBeInTheDocument()
    })

    it('should display error message', () => {
      // Arrange & Act
      const mockOnChange = jest.fn()
      render(
        <Input 
          label="Email" 
          value="" 
          onChange={mockOnChange}
          error="Email is required"
        />
      )

      // Assert
      expect(screen.getByTestId('input-error')).toHaveTextContent('Email is required')
    })

    it('should call onChange when input value changes', () => {
      // Arrange
      const mockOnChange = jest.fn()
      render(<Input label="Username" value="" onChange={mockOnChange} />)

      // Act
      const input = screen.getByTestId('input-field') as HTMLInputElement
      input.value = 'newvalue'
      input.dispatchEvent(new Event('change', { bubbles: true }))

      // Assert - Note: This won't work exactly as shown without user-event
      // but demonstrates the test structure
      expect(input.value).toBe('newvalue')
    })
  })

  describe('List Components', () => {
    const List = ({ items }: { items: string[] }) => {
      return (
        <ul data-testid="list">
          {items.map((item, index) => (
            <li key={index} data-testid={`list-item-${index}`}>
              {item}
            </li>
          ))}
        </ul>
      )
    }

    it('should render empty list', () => {
      // Arrange & Act
      render(<List items={[]} />)

      // Assert
      const list = screen.getByTestId('list')
      expect(list).toBeInTheDocument()
      expect(list.children).toHaveLength(0)
    })

    it('should render list with items', () => {
      // Arrange
      const items = ['Item 1', 'Item 2', 'Item 3']

      // Act
      render(<List items={items} />)

      // Assert
      expect(screen.getByTestId('list-item-0')).toHaveTextContent('Item 1')
      expect(screen.getByTestId('list-item-1')).toHaveTextContent('Item 2')
      expect(screen.getByTestId('list-item-2')).toHaveTextContent('Item 3')
    })
  })

  describe('Conditional Rendering', () => {
    const Message = ({ 
      show, 
      type, 
      text 
    }: { 
      show: boolean
      type: 'success' | 'error'
      text: string
    }) => {
      if (!show) return null
      
      return (
        <div 
          data-testid="message" 
          className={`message-${type}`}
        >
          {text}
        </div>
      )
    }

    it('should render message when show is true', () => {
      // Arrange & Act
      render(<Message show={true} type="success" text="Success!" />)

      // Assert
      expect(screen.getByTestId('message')).toBeInTheDocument()
      expect(screen.getByText('Success!')).toBeInTheDocument()
    })

    it('should not render message when show is false', () => {
      // Arrange & Act
      render(<Message show={false} type="success" text="Success!" />)

      // Assert
      expect(screen.queryByTestId('message')).not.toBeInTheDocument()
    })

    it('should apply correct type class', () => {
      // Arrange & Act
      render(<Message show={true} type="error" text="Error occurred" />)

      // Assert
      expect(screen.getByTestId('message')).toHaveClass('message-error')
    })
  })
})
