import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { AuthContext } from '@/contexts/AuthContext'
import { AuthContextType } from '@/types/auth'
import { vi } from 'vitest'

// Mock auth context value
const mockAuthContext: AuthContextType = {
  user: null,
  session: null,
  loading: false,
  signUp: vi.fn().mockResolvedValue({ error: null }),
  signIn: vi.fn().mockResolvedValue({ error: null }),
  signOut: vi.fn().mockResolvedValue(undefined),
  register: vi.fn().mockResolvedValue({ error: null }),
  login: vi.fn().mockResolvedValue({ error: null }),
  logout: vi.fn().mockResolvedValue(undefined),
}

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  authContext?: Partial<AuthContextType>
  initialEntries?: string[]
}

const AllTheProviders = ({ 
  children, 
  authContext = {},
  initialEntries = ['/']
}: { 
  children: React.ReactNode
  authContext?: Partial<AuthContextType>
  initialEntries?: string[]
}) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  const authValue = { ...mockAuthContext, ...authContext }

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthContext.Provider value={authValue}>
          {children}
        </AuthContext.Provider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options: CustomRenderOptions = {}
) => {
  const { authContext, initialEntries, ...renderOptions } = options

  return render(ui, {
    wrapper: (props) => (
      <AllTheProviders 
        {...props} 
        authContext={authContext}
        initialEntries={initialEntries}
      />
    ),
    ...renderOptions,
  })
}

export * from '@testing-library/react'
export { customRender as render }
export { mockAuthContext }