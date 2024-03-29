import {setError, store} from '../redux/redux';

export function HandleError(target: Object, key: string | symbol, descriptor: PropertyDescriptor): void {
  const original = descriptor.value
  descriptor.value = function (...args: any[]): void {
    try {
      return original.apply(this, args)
    } catch (err: any) {
      console.error('ERROR: ', err)
      console.warn('client_error: ', err.message)
      store.dispatch(setError(err.message))
    }
  }
}
