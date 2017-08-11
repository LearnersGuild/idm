export const DISMISS_ERROR = 'DISMISS_ERROR'

export default function dismissError(index) {
  return {type: DISMISS_ERROR, index}
}
