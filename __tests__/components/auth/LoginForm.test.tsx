import { render, screen, fireEvent } from '@testing-library/react'
import LoginForm from '@/components/auth/LoginForm'

describe('LoginForm', () => {
  it('renders login form', () => {
    render(<LoginForm />)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
  })

  it('validates required fields', async () => {
    render(<LoginForm />)
    fireEvent.click(screen.getByRole('button', { name: /login/i }))
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument()
  })
})