import React from 'react'

export type HandlerRef = {
    proceedHandler: () => Promise<void | boolean>,
    state: "idle" | "loading" | "error" | "success" | undefined
}

export type ModalRef = {
    proceed: () => Promise<void | boolean>,
    close: () => void
}

export type ModalProps = {
    title: string,
    proceedLabel: string,
    proceedChild: React.ReactNode | undefined,
    cancelLabel: string,
    children: React.ReactNode
    childRef: React.RefObject<HandlerRef>
    // identifying part of the route when modal should be visible. Only needed for web
    routeIdentifier: string
}

export type ProceedProps = {
    state: "idle" | "loading" | "error" | "success" | undefined
    handleProceed: () => void
    label: string
}