import { Alert } from 'react-native'

export const confirmAlert = (message: string, onConfirm: () => void, onCancel = () => {}, isDestructive = false, title = "") =>
    Alert.alert(title, message, [
        {
            text: 'Abbrechen',
            onPress: onCancel,
            style: 'cancel',
        },
        {text: isDestructive ? 'Löschen' : 'OK', onPress: onConfirm, style: isDestructive ? 'destructive' : 'default'},
    ]);