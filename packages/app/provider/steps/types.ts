export type StepsContextType = {
    state: boolean | undefined
    backgroundState: boolean | undefined
    needOverwrite: boolean
    needPedometerOverwrite: boolean
    needBackgroundOverwrite: boolean
    toggle: () => void
    toggleBackground: () => void
}
