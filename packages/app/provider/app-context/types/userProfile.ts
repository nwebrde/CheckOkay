import { User } from 'app/provider/auth-context/types'
import Check from 'app/provider/app-context/types/check'
import Guard from 'app/provider/app-context/types/guardUser'

export default interface UserProfile {
  id: string
  name?: string
  email: string
  image?: string
}
