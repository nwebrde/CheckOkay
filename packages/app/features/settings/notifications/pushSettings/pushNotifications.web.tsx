import { useNotifications } from 'app/provider/notifications'
import { SettingsGroup } from 'app/design/settings/group'
import { SettingsRow } from 'app/design/settings/row'
import { Switch } from 'react-native'
import { trpc } from 'app/provider/trpc-client'
import React, { useEffect, useState } from 'react'
import { Text } from 'app/design/typography'
import { openAppSettings, useNotificationPermissions } from 'app/lib/notifications/permissionsUtil'

export function PushNotifications() {
    return(<></>)

}