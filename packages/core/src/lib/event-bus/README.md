# EventBus

The `EventBus` is a TypeScript publish-n-subscribe service that enables views and services to communicate anonymously **without** type couplings.

Sometimes known as a _messaging backplane_, the `EventBus` can be used in a wide set of scenarios to exchange notifications and contextual information.

[![](https://i.imgur.com/5UeHUgj.png)](https://i.imgur.com/5UeHUgj.png)

Leveraging the _Observer_ Pattern within RxJS, the `EventBus` is a powerful, lightweight mechanism for messaging within an Angular/React/NextJS SPA or a NodeJS application.

- **Producers** (aka _publishers_) do not care who consumers the events, how many are listening, nor how the data will be used.
- **Consumers** (aka _subscribers_) do not know about Producer types or `why`/`when` triggers.
- **Events** are simple payload objects

> The EventBus will cache the most recent event for **EACH** type dispatched/emitted.

<br/>

## `EventBus` API

The `EventBus` API is deliberately light-weight and uses RxJS to stream 1..n events to 1..n listeners.

- `announce(event: EmitEvent<unknown>): void`
- `on<T>(event: string, notify: (data: T) => void): Unsubscribe`
- `onMany(collection: EventRegistrations): Unsubscribe`

```ts
interface EmitEvent<K extends unknown> {
  type: string;
  data?: K;
}
```

<br/>

##### (1) `announce(event: EmitEvent<unknown>): void`

Dispatch event notifications to all listeners (if any) for this specific event

##### (2) `on<T>(event: string, notify: (data: T) => void): Unsubscribe`

Register listener for specific events.

##### (3) `onMany(batch: EventRegistrations): Unsubscribe`

Batch register listeners for 1...n events; each event may have their own listener

##### (4) `observableFor<T>(event: string): Observable<T>`

Direct access to a specific event stream; useful to add extra transform operators, and more...

<br/>

---

### EventBus + MFE(s)

As teams explore deployment of multiple micro-experiences (aka MFE), one important consideration is how such autonomous SPAs can intercommunicate.

![](https://i.imgur.com/2DteM81.png)

Since the `EventBus` is framework agnostic, multiple isolated instances can easily be employed.

- as an SPA-internal messaging system, and
- as an SPA-external inter-commmunication system

It should be noted, however, that the EventBus enables **Reactive Architectures** and is not intended as- nor suitable for 'request-response' (aka pull-based) solutions.

<br/>

---

### EventBus + Facades

Consider an application with a Shopping cart and an Order Editor. Wheneven an
order is updated, the following should occur:

- The `ShoppingCart` views should be updated
- Google analytics should be notified

[![](https://i.imgur.com/AMMsRqs.png)](https://i.imgur.com/AMMsRqs.png)

Two (2) independent Facades - managing their own internal stores - code can easily coordinate using the `EventBus`:

```ts
@Injectable()
export class OrderFacade {
  order$: Observable<Order> = this.query.order$;
  ordersItems$: Observable<OrderItem[]> = this.query.orderItems$;
  isLoading$ = this.query.selectLoading();

  constructor(
    private store: OrderStore,
    private query: OrderQuery,
    private eventBus: EventBus
  ) {
    this.query.order$.subscribe((order) => {
      if (order) {
        // Use the EventBus to announce order updates
        eventBus.announce(orderUpdated(order));
      }
    });
  }
}
```

Here ^ the `OrderFacade` is not aware who is interested in the event...

```ts
@Injectable()
export class ShoppingCarFacade {
  allOrders$: Observable<OrderSummary[]> = this.query.allOrders$;

  constructor(
    private service: OrderService,
    private store: OrderListStore,
    private query: OrderListQuery,
    private eventBus: EventBus;
    private disconnect: Unsubscribe;
  ) {

    // Listen for all order changes
    this.disconnect = eventBus.on(
      BusEventTypes.ORDER_UPDATED,
      this.upsertOrder.bind(this)
    );

    // Load all orders
    this.loadAllOpen();
  }
}
```

Note that the `ShoppingCartFacade` is responsible for disconnecting its subscription to the EventBus using the `disconnect` function returned from `eventBus.on()`.

<br/>

---

<br/>

## `EventBus`: Source Code

[eventbus.ts](./eventbus.ts)
