## TypeScript Utils 


### [**`switchCase()`**](./switchCase.ts)

We often want to reduce the verbosity of a stand `switch()` block into something more consumable. Using functional approaches we can easily implement code like the samples shown below.

> We can also use TypeScript to provide IDE intellisense errors.

```ts

const dayofWeek = switchCase({
  0: 'Sunday',
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday'
},'Unknown'));

const currentDay = dayofWeek(new Date().getDay())

```

We can also easily use the `switchCase()` to implement terse Redux reducers:

```ts

export const counterReducer = <T extends ActionNames<typeof handleAction>>(
  state: number, action: { type: T }
) => {
  const handleAction = switchCase({
     'INCREMENT': () => state + 1,
     'DECREMENT': () => state - 1,
     'RESET': 0,
  }, state);
  return handleAction(action.type);
};

console.log(counterReducer(0, { type: 'INCREMENT' }));      // perfect
console.log(counterReducer("wrong", { type: 'FOO' }));      // intellisense shows errors  
console.log(counterReducer(0, { type: 'FOO' }));            // intellisense shows errors

```

