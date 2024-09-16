export const confirmAlert = (message: string, onConfirm: () => void, onCancel = () => {}, isDestructive = false, title = "") =>
{
    if (typeof window !== "undefined") {
        const result = window.confirm(message)
        if (result) {
            onConfirm()
        } else {
            onCancel()
        }
    }
}