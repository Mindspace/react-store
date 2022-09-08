import { VirtualTimeScheduler } from 'rxjs';
import { AsyncScheduler } from 'rxjs/internal/scheduler/AsyncScheduler';

declare const UNDEFINED_VOID_ONLY: unique symbol;
// tslint:disable-next-line: void-return
type VoidOrUndefinedOnly = void | { [UNDEFINED_VOID_ONLY]: never };
export interface ActHandler {
  (callback: () => VoidOrUndefinedOnly): void;
  //(callback: () => Promise<void>): Promise<undefined>;
}

export const ReactTesting = {
  act: (callback: () => void) => {
    return callback();
  },
};

type DoneCallback = () => void;
/**
 * fakeTime() is a HoF wrapper for the handler function specified
 * in the Jest `it('', <handler>){}`.
 *
 * This HoF will override the RxJS scheduler to use a virtual
 * scheduler to easily allow testing of RxJS operators like `debounceTime()` etc.
 *
 * The `callback` can accept 1-2 arguments:
 *
 *    `(flush, done) => {}`, or
 *    `(done) => {}`
 *
 * The callback is considered Async if the original callback funciton has
 * the shape `(flush, done) => {}`
 *
 * @param callback
 * @returns Function handler function that is used by Jest
 */
export function fakeTime(callback: (...args: any[]) => any) {
  if (callback.length === 0) throwCallbackError();

  const isAsync = callback.length !== 1;
  const invokeCallback = (done?: DoneCallback) => {
    const virtualScheduler = new VirtualTimeScheduler();
    const flush = () => virtualScheduler.flush();

    AsyncScheduler.delegate = virtualScheduler;

    const params = isAsync ? [flush, done] : [flush];
    const response = callback(...params);

    AsyncScheduler.delegate = undefined;

    return response;
  };
  const syncCallback = () => invokeCallback();
  const asyncCallback = (done: DoneCallback) => invokeCallback(done);

  return isAsync ? asyncCallback : syncCallback;
}

/**
 * Instead of using publishing a `flush` callback, this HoF
 * instead publishes a special `act()` wrapper that internally
 * calls `flush()` before completing.
 *
 * Use this when testing hooks that are internally using/waiting on
 * code that employs an RxJS scheduler.
 */
export function fakeTimeWithAct(callback: (...args: any[]) => any) {
  if (callback.length === 0) throwCallbackError();

  const isAsync = callback.length !== 1;
  const invokeCallback = (done?: DoneCallback) => {
    const virtualScheduler = new VirtualTimeScheduler();
    const actAndFlush = (fn: () => void) => {
      ReactTesting.act(() => {
        fn();
        virtualScheduler.flush();
      });
    };
    AsyncScheduler.delegate = virtualScheduler;

    const params = isAsync ? [actAndFlush, done] : [actAndFlush];
    const response = callback(...params);

    AsyncScheduler.delegate = undefined;

    return response;
  };
  const syncCallback = () => invokeCallback();
  const asyncCallback = (done: DoneCallback) => invokeCallback(done);

  return isAsync ? asyncCallback : syncCallback;
}

function throwCallbackError() {
  throw new Error(`
  "fakeTime()" callback must be declared with at least one parameter
  For example: fakeAsync((flush)=> ...)
  `);
}
