import { AuthClient } from '@supabase/auth-js/index'
import { SupabaseAuthClientOptions } from './types'

export class SupabaseAuthClient extends AuthClient {
  constructor(options: SupabaseAuthClientOptions) {
    super(options)
  }
}
