## React Custom Hooks

React offers developers **partial** DI with the Context and `useContext()` hook. These are used to lookup services, objects, and values.

This is not, however, true Dependency Injection.

![Example of DI](https://miro.medium.com/max/933/0*iUIQobZyB-NbqLkT.png)

Read [Universal Dependency Injection](https://thomasburlesonia.medium.com/https-medium-com-thomasburlesonia-universal-dependency-injection-86a8c0881cbc)

### `useInjectorHook()`

##### Solution #1

When using this library's [Dependency Injection](../di/README.md) features, developers must first configure and instantiate a custom injector

![image](https://cdn-images-1.medium.com/max/1600/0*Eh3cUl1ZGH1JNo2J.png)

which then requires the code use `injector.get(<token>)` in the application code

![image](https://cdn-images-1.medium.com/max/1600/0*8RxFA4TCQT7YnNEq.png)

> This works... but we can make it better!

<br/>

##### Solution #2

Using the `useInjectorHook()` feature, performing a DI singleton lookups is trivial:

![image](https://cdn-images-1.medium.com/max/1600/1*S07nQz971o_9_xgP89p_yg.png)

Then - in your View layers - use your custom injector hook for super simply DI lookups

![image](https://cdn-images-1.medium.com/max/1600/1*eTzfEeMKVB-kU3qLTsjUKg.png)

<br/>

---

### `useObservable` Hook

React view components use state and props to render JSX (templates). In scenarios where the state values will be updated asynchronously based on emissions from Observable streams, the required code complexity becomes problematic.

In such scenarios, developers are required to:

- subscribe to the stream
- update the component state with emitted stream values
- trigger view component re-renders
- unsubscribe from the stream:
  - when a new observable instance replaces a previous instance
  - when the component unmounts

_`useObservable<T>()`_ is 'typed' custom hook that dramatically simplifies the implementation of these ^ requirements. The hook itself internally manages the subscription lifecycles and dramatically reduces the code previously required withing a React view component.

[![image](https://user-images.githubusercontent.com/210413/67902428-2724b180-fb37-11e9-9904-558952d2cf66.png)
](https://github.com/Mindspace/react-workshop/blob/finish/rxjs/apps/starter/src/app/ui/contacts/contacts-list.tsx#L41-L55)

<br/>

> For Angular developers, this hook provides the same functionality as the template `async` pipe.
