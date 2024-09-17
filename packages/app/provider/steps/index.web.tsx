// on web, we do not yet support push notifications

import React from 'react'

export const StepProvider = ({ children }: { children: React.ReactElement }) => (
  <>{children}</>
)

export function useSteps() {}
