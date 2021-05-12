export function HandleError(target: Object, key: string | symbol, descriptor: PropertyDescriptor): void {
  const original = descriptor.value
  descriptor.value = function (...args: any[]): void {
    try {
      return original.apply(this, args)
    } catch (err) {
      console.warn('client_error: ', err.message)
    }
  }
}
