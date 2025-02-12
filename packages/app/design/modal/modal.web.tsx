import React, { forwardRef, useEffect, useImperativeHandle } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'
import { Button } from 'app/design/button'
import { ActivityIndicator } from 'react-native'
import { ModalProps, ModalRef, ProceedProps } from 'app/design/modal/types'

const Proceed = ({ state, handleProceed, label } : ProceedProps) => {
    return (
        <>
            {(state == 'idle' || !state) &&
                <Button text={label} onClick={handleProceed} />
            }
            {state == 'loading' &&
                <ActivityIndicator />
            }
        </>

    )
}

export const Modal = forwardRef<ModalRef, ModalProps>(({title, proceedLabel, proceedChild, cancelLabel, routeIdentifier, children, childRef}, ref) => {

    let [isOpen, setIsOpen] = useState(true)

    const router = useRouter()
    const pathname = usePathname()

    function close() {
        setIsOpen(false)
    }

    function afterLeave() {
        router.push(".")
    }

    useEffect(() => {
        if(pathname.includes(routeIdentifier)) {
            setIsOpen(true)
        }
    }, [pathname]);


    async function proceed() {
        try {
            await childRef.current?.proceedHandler()
            close();
        } catch (error) {
        }
    }

    useImperativeHandle(ref, () => {
        return {
            close,
            proceed
        }
    }, [childRef])

    return (
        <>
            <Transition appear show={isOpen} afterLeave={afterLeave} as={Fragment} >
                <Dialog as="div" className="relative z-10" onClose={close}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel
                                    className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900"
                                    >
                                        {title}
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        {children}
                                    </div>

                                    <div className="mt-4 flex flex-row justify-around">
                                        {cancelLabel &&
                                        <Button text={cancelLabel} onClick={close} />
                                        }
                                        {proceedLabel &&
                                        <Proceed label={proceedLabel} state={childRef.current?.state} handleProceed={proceed} />
                                        }
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
})