import React, { useRef } from 'react'
import { AddMail } from 'app/features/settings/notifications/AddMail'
import Modal from 'app/design/modal/modal'
import { HandlerRef } from 'app/design/modal/types'

export default function Page() {
    const ref = useRef<HandlerRef>(null);
    return (
            <Modal title="Email hinzufügen" cancelLabel="Abbrechen" proceedLabel="Hinzufügen" childRef={ref} routeIdentifier="addMail">
                <AddMail ref={ref} />
            </Modal>
        )
}