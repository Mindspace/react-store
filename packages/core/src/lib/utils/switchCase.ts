/**
 *  Utility `switchCase` to functionaly make case statements easy to process by
 *  using a case hashmap:
 * 
 *  @Code
 *    (1) Used to perform quick lookups with fallbacks
 * 
 *        const dayofWeek: SwitchCase<number, string> = switchCase({
 *          0: 'Sunday',
 *          1: 'Monday',
 *          2: 'Tuesday',
 *          3: 'Wednesday',
 *          4: 'Thursday',
 *          5: 'Friday',
 *          6: 'Saturday'
 *        },'Unknown'));
 *    
 *        const currentDay = dayofWeek(new Date().getDay())
 *
 * 
 *     (2)  Used to simply Redux state reducers:
 * 
 *         export const counterReducer = <T extends ActionNames<typeof handleAction>>(            
 *           state: number, action: { type: T }        
 *         ) => {         
 *           const handleAction = switchCase({         
 *              'INCREMENT': () => state + 1,         
 *              'DECREMENT': () => state - 1,         
 *              'RESET': 0,         
 *           }, state);         
 *           return handleAction(action.type);         
 *         };         
 *                 
 *         console.log(counterReducer(0, { type: 'INCREMENT' }));      // perfect   
 *         console.log(counterReducer("wrong", { type: 'FOO' }));      // intellisense shows errors   
 *         console.log(counterReducer(0, { type: 'FOO' }));            // intellisense shows errors
 */

type Value<T> = T | (() => T);
type CaseOfDefault<C, V> = (key: keyof C) => V | (() => V);
export type ActionNames<T extends (_: any) => any> = Parameters<T>[0];

const findCaseValue = <C, V>(cases: C, defaultCase: V): CaseOfDefault<C, V>  => {
  return ((key: keyof C) => cases[key] || defaultCase) as CaseOfDefault<C, V>;
};

export const switchCase = <V, C extends Record<string, Value<V>>>(
  cases: C, defaultCase: V
) => {
  return (key: keyof C) => {
    const f = findCaseValue(cases, defaultCase)(key);
    return f instanceof Function ? f() as V : f;
  };
}