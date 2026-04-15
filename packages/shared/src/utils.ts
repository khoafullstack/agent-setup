export function formatMessage(msg: string): string {
  return `[opencode-setup] ${msg}`
}

export function logInfo(msg: string): void {
  console.log(formatMessage(msg))
}

export function logError(msg: string): void {
  console.error(formatMessage(msg))
}
