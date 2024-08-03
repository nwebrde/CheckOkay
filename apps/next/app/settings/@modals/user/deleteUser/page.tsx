'use client';

import React, { useRef } from 'react'
import {Modal} from 'app/design/modal/modal'
import { HandlerRef } from 'app/design/modal/types'
import { DeleteUser } from 'app/features/settings/user/DeleteUser'

export default function Page() {
    const ref = useRef<HandlerRef>(null);
    return (
        <Modal title="Konto löschen" cancelLabel="Abbrechen" proceedLabel="Fortfahren" childRef={ref} routeIdentifier="deleteUser">
            <DeleteUser ref={ref} />
        </Modal>
    )
}