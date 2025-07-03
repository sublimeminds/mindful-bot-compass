import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/utils'
import { useAuth } from '@/hooks/useAuth'
import React from 'react'

// Simple test component to verify auth context
const TestAuthComponent = () => {
  const { user, loading, login, logout } = useAuth()
  
  if (loading) return <div>Loading...</div>
  
  return (
    <div>
      <div data-testid="user-status">
        {user ? `Logged in as ${user.email}` : 'Not logged in'}
      </div>
      <button onClick={() => login('test@test.com', 'password')}>
        Login
      </button>
      <button onClick={() => logout()}>
        Logout
      </button>
    </div>
  )
}

describe('Auth System', () => {
  it('should render auth context correctly', async () => {
    render(<TestAuthComponent />)
    
    expect(screen.getByTestId('user-status')).toHaveTextContent('Not logged in')
    expect(screen.getByText('Login')).toBeInTheDocument()
    expect(screen.getByText('Logout')).toBeInTheDocument()
  })

  it('should handle user login', async () => {
    const mockUser = { 
      id: '1', 
      email: 'test@test.com',
      app_metadata: {},
      user_metadata: {},
      aud: 'authenticated',
      created_at: '2023-01-01T00:00:00Z'
    } as any
    
    render(<TestAuthComponent />, {
      authContext: { user: mockUser }
    })
    
    expect(screen.getByTestId('user-status')).toHaveTextContent('Logged in as test@test.com')
  })
})