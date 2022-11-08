export interface ILogger {
  logError: (message: string) => Promise<void>
}
