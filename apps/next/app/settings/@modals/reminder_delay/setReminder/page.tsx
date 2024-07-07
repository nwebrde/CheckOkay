'use client';

import React, { useEffect, useRef } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { Text } from 'app/design/typography'
import { AddMail } from 'app/features/settings/notifications/AddMail'
import { useRouter } from 'next/navigation'
import { usePathname, useSelectedLayoutSegment } from 'next/navigation'
import { TimePicker } from 'app/design/timepicker/timepicker'
import { View } from 'app/design/view'
import { SetReminder, SetReminderHandle } from 'app/features/settings/notifications/SetReminder'
import { Button, StyledPressable } from 'app/design/button'
import { ActivityIndicator } from 'react-native'

type ProceedProps = {
    state: "idle" | "loading" | "error" | "success"
    handleProceed: () => void
}

const Proceed = ({ state, handleProceed } : ProceedProps) => {
    return (
        <>
            {state == 'idle' &&
                <Button text="Fertig" onClick={handleProceed} />
            }
            {state == 'loading' &&
                <ActivityIndicator />
            }
        </>

    )
}

export default function Page() {

    let [isOpen, setIsOpen] = useState(true)

    const router = useRouter()
    const pathname = usePathname()

    function closeModal() {
        setIsOpen(false)
    }

    function openModal() {
        setIsOpen(true)
    }

    function afterLeave() {
        router.push(".")
    }

    useEffect(() => {
        if(pathname.includes("addMail")) {
            openModal()
        }
    }, [pathname]);


    const ref = useRef<SetReminderHandle>(null);

    async function handleDone() {
        try {
            await ref.current?.done()
            closeModal();
        } catch (error) {
        }
    }
    return (
        <>
            <Transition appear show={isOpen} afterLeave={afterLeave} as={Fragment} >
                <Dialog as="div" className="relative z-10" onClose={closeModal}>
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
                                        Erinnerungen
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <View className="self-center p-5 pt-10">
                                            <SetReminder ref={ref} />
                                            <Text className="mt-10">Wähle aus, wie viele Stunden und Minuten vor einem Check-In wir dich daran erinnern rückzumelden. Ziehe dafür die Zahlen an die gewünschte Position</Text>
                                        </View>
                                    </div>

                                    <div className="mt-4 flex flex-row justify-around">
                                        <Button text="Abbrechen" onClick={() => router.push(".")} />
                                        <Proceed state={ref.current!.state} handleProceed={handleDone} />
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}