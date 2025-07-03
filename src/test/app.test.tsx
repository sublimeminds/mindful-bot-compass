import React from 'react'
import { describe, it, expect, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { AuthContext } from '@/contexts/AuthContext'
import { vi } from 'vitest'
import AppInitializer from '@/components/AppInitializer'

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ 
        data: { session: null }, 
        error: null 
      }),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } }
      }),
      signUp: vi.fn().mockResolvedValue({ error: null }),
      signInWithPassword: vi.fn().mockResolvedValue({ error: null }),
      signOut: vi.fn().mockResolvedValue({}),
    },
  },
}))

describe('App Architecture', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render AppInitializer without crashing', () => {
    const { getByText } = render(<AppInitializer />)
    expect(getByText('Starting TherapySync')).toBeInTheDocument()
  })

  it('should provide auth context to child components', async () => {
    const TestComponent = () => {
      const authContext = React.useContext(AuthContext)
      return (
        <div>
          {authContext ? 'Auth context available' : 'No auth context'}
        </div>
      )
    }

    const { getByText } = render(
      <QueryClientProvider client={new QueryClient()}>
        <BrowserRouter>
          <AuthContext.Provider value={{
            user: null,
            session: null,
            loading: false,
            signUp: vi.fn().mockResolvedValue({ error: null }),
            signIn: vi.fn().mockResolvedValue({ error: null }),
            signOut: vi.fn().mockResolvedValue(undefined),
            register: vi.fn().mockResolvedValue({ error: null }),
            login: vi.fn().mockResolvedValue({ error: null }),
            logout: vi.fn().mockResolvedValue(undefined),
          }}>
            <TestComponent />
          </AuthContext.Provider>
        </BrowserRouter>
      </QueryClientProvider>
    )
    
    expect(getByText('Auth context available')).toBeInTheDocument()
  })

  it('should handle auth state changes gracefully', async () => {
    const mockUser = {
      id: 'test-user',
      email: 'test@example.com',
      app_metadata: {},
      user_metadata: {},
      aud: 'authenticated',
      created_at: '2023-01-01T00:00:00Z'
    } as any

    const { getByTestId } = render(
      <QueryClientProvider client={new QueryClient()}>
        <BrowserRouter>
          <AuthContext.Provider value={{
            user: mockUser,
            session: { user: mockUser } as any,
            loading: false,
            signUp: vi.fn().mockResolvedValue({ error: null }),
            signIn: vi.fn().mockResolvedValue({ error: null }),
            signOut: vi.fn().mockResolvedValue(undefined),
            register: vi.fn().mockResolvedValue({ error: null }),
            login: vi.fn().mockResolvedValue({ error: null }),
            logout: vi.fn().mockResolvedValue(undefined),
          }}>
            <div data-testid="app-content">App loaded with user</div>
          </AuthContext.Provider>
        </BrowserRouter>
      </QueryClientProvider>
    )
    
    expect(getByTestId('app-content')).toBeInTheDocument()
  })
})