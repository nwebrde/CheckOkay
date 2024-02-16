import type { Check as UserCheck } from 'app/lib/types/check'
export default interface Check extends UserCheck {
    notifyId?: string
    backupId?: string
    userId: string
}
