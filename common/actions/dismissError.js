const DISMISS_ERROR = 'DISMISS_ERROR'

export function dismissError(index) {
  return {type: DISMISS_ERROR, index}
}
