/**
 * @param ms timeout in milliseconds
 */
export const setTimeoutAsync = (ms: number): Promise<null> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(null), ms)
  })
}
