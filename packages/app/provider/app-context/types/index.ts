import GuardUser, { GuardType } from 'app/provider/app-context/types/guardUser'
import Check from 'app/provider/app-context/types/check'
import GuardedUser from 'app/provider/app-context/types/guardedUser'
import { CheckSettings } from 'app/provider/app-context/types/settings'

export default interface AppContext {
  checks: Check[]
  guards: GuardUser[]
  guarded: GuardedUser[]
  checkSettings: CheckSettings

  addCheck(hour: number, minute: number): Promise<boolean>
  removeCheck(checkId: number): Promise<boolean>
  modifyCheck(checkId: number, hour: number, minute: number): Promise<boolean>

  setNotifyBeforeCheck(newValue: number | false): Promise<boolean>
  setNotifyBackupGuards(newValue: number): Promise<boolean>

  removeGuard(userId: string): Promise<boolean>
  setGuardType(userId: string, guardType: GuardType): Promise<boolean>
}
