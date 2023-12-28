import React, { useState } from 'react'
import { useStorageState } from 'expo-app/lib/useStorageState'
import { refresh, signIn, signOut } from 'expo-app/lib/OAuthClient'
import type AppContext from 'app/provider/app-context/types'

const AppContext = React.createContext<AppContext | null>(null)

// This hook can be used to access the user info.
export function useApp() {
  const value = React.useContext(AppContext)
  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error('useApp must be wrapped in a <AppProvider />')
    }
  }

  return value
}

export function AppProvider(props: React.PropsWithChildren) {
  const [checks, setChecks] = useState()

  const appValue: AppContext = {
    checks: checks,
  }

  return (
    <AppContext.Provider value={appValue}>{props.children}</AppContext.Provider>
  )
}
