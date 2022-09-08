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

- `emit(event: EmitEvent<unknown>): void`
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

  constructor(private store: OrderStore, private query: OrderQuery, private eventBus: EventBus) {
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

```ts
import { Subject, Observable, of } from 'rxjs';
import { filter, map, startWith, tap, takeUntil } from 'rxjs/operators';

type Unsubscribe = () => void;
const DestroyEvent = '[EventBus] destory';

export interface EmitEvent<K extends unknown> {
  type: string;
  data?: K;
}

export type EventRegistrations = Record<string, (data: unknown) => void>;
export const destroyEventBus = () => ({ type: DestroyEvent });

/**
 * Simply Pub/Sub mechanism that support decoupled communication between services
 * Note: This EventBus does cache the most recent event for EACH type...
 */
export class EventBus {
  private cache: Record<string, EmitEvent<unknown>>;
  private emitter: Subject<EmitEvent<unknown>>;
  private destroy$: Observable<EmitEvent<unknown>>;

  constructor(private enableLogs = false) {
    this.cache = {};
    this.destroy$ = of({ type: 'waiting' });
    this.emitter = new Subject<EmitEvent<unknown>>();

    this.reset();
  }

  /**
   * Public API to stop all current subscriptions
   * and reset with clean EventBus
   */
  reset() {
    this.emit(destroyEventBus());

    this.listenForDestroy();
    this.captureEvents();
  }

  /**
   * Emit an event to all listeners on this messaging queue
   */
  announce(event: EmitEvent<unknown>) {
    this.enableLogs && console.log(`[EventBus] emit(${event.type})`);
    this.emitter.next(event);
  }

  /**
   * Easily listen to a collection of events
   * And provide single teardown to disconnect all
   * internal connections.
   */
  onMany(collection: EventRegistrations): Unsubscribe {
    const eventKeys = Object.keys(collection);
    const connections = eventKeys.map((key) => this.on(key, collection[key]));

    return () => {
      connections.map((teardown) => teardown());
    };
  }

  /**
   * Listen on a single event, extract data
   * Publish a teardown function to disconnect later
   * Will immediately emit the most recent event IF currently in the cache.
   */
  on<T>(event: string, notify: (data: T) => void): Unsubscribe {
    const watch$ = this.observableFor(event);
    const subscription = watch$.subscribe((data) => {
      this.enableLogs && console.log(`[EventBus] on(${event})`);
      notify(data as T);
    });

    return subscription.unsubscribe.bind(subscription);
  }

  /**
   * Get an observable stream for a specific event
   */
  observableFor<T>(event: string): Observable<T> {
    const watch$ = this.emitter.pipe(
      startWith(this.cache[event]),
      takeUntil(this.destroy$),
      filter((e: EmitEvent<T>) => e.type === event),
      map((e: EmitEvent<T>) => e.data)
    );
    return watch$ as Observable<T>;
  }

  /**
   * Enable events to stop ALL subscriptions
   * Create special stream that ONLY emits destroy events
   */
  private listenForDestroy() {
    const clearCache = () => (this.cache = {});
    const onlyDestroyEvents = ({ type }: EmitEvent<unknown>) => type === DestroyEvent;

    this.destroy$ = this.emitter.pipe(filter(onlyDestroyEvents), tap(clearCache));
  }

  /**
   * Activate event interceptor to record last emission for each event type.
   * This will record most-recent events regardless of any subscribers/listeners.
   *
   * NOTE: do not capture the 'destroy' event
   */
  private captureEvents() {
    const notDestroyEvents = ({ type }: EmitEvent<unknown>) => type !== DestroyEvent;
    const events$ = this.emitter.pipe(takeUntil(this.destroy$), filter(notDestroyEvents));

    // Cache the event by its type
    activity$.subscribe((e: EmitEvent<unknown>) => {
      this.cache[e.type] = e;
    });
  }
}
```
