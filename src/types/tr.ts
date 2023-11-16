export interface TRLoginReturnValue {
  processId: string;
  countdownInSeconds: number;
  '2fa': 'SMS';
  loginCookies: string[];
}

export interface TRLoginError {
  errors: Error[];
}

export interface Error {
  errorCode: string;
  errorMessage: null;
  meta: Meta;
}

export interface Meta {
  _meta_type: string;
  nextAttemptInSeconds: number;
  nextAttemptTimestamp: string;
}
