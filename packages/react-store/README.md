# @mindspace-io/react-store

[![GitHub version](https://badge.fury.io/gh/Mindspace%2Freact-store.svg)](https://badge.fury.io/gh/Mindspace%2Freact-store)

## Purpose

This library provides TypeScript utilities for React (16.x or higher) developers.

- State Management using `createStore()` and `useStore()`
- `useObservable()` for RxJS streams

---

### Reactive Store

Easily build shared, reactive stores for your state management features:

![store-view](https://user-images.githubusercontent.com/210413/112065962-8c65b200-8b33-11eb-86b5-1bf831b6f4de.jpg)

- [**`createStore()`**](https://github.com/Mindspace/react-store/blob/master/packages/react-store/docs/stateManagement.md)

<br>

---

### React Hooks

Custom hooks for DependencyInjection (DI) and RxJS subscription management.

![image](https://user-images.githubusercontent.com/210413/68954901-8961f100-078a-11ea-8141-eac38ab21dab.png)

- [**`useInjectorHook()`** for fast DI lookups of singleton services](https://github.com/Mindspace/react-store/blob/master/packages/react-store/docs/useInjector.md). Note this feature depends up the `@mindspace-io/core` DI code.
- [**`useObservable()`** for 'Async pipe'-like functionality](https://github.com/Mindspace/react-store/blob/master/packages/react-store/docs/useObservable.md)

<br>

---

### Installation

To easily use this library, just use `npm install @mindspace-io/react-store`
