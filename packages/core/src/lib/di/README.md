## Universal Dependency Injection

Dependency Injection (DI) is a architectural system process found in many software frameworks or technology:

* [Spring](https://www.journaldev.com/2394/java-dependency-injection-design-pattern-example-tutorial), 
* [Flex](https://www.adobe.com/devnet/flex/articles/dependency_injection.html), 
* [Swiz](https://swizframework.jira.com/wiki/spaces/SWIZ/pages/1998872/Dependency+Injection),
* [Angular](https://angular.io/guide/dependency-injection), 
* etc.

Dependency injection is a solution in which a system supplies *dependencies* [to a target construction] from external sources rather than creating them itself. 
> Dependencies are services, objects, functions, or values that a target class (or factory, function) needs to perform its function.

Most developers think DI is only useful for testing with mocks, spys, and stubs. The true value of DI, however, is its ability to decouple origination **configuration**, **construction**, and **caching** from *destination* USE.

<br/>

---- 

The DI solution implemented here does NOT use reflection, decorators, nor any other more advanced feature. The DependencyInjector is a lightweight, stand-alone solution that can work with any ES6/TypeScript framework or application.

----

<br/>

### Traditional Scenario

Consider the following coupling of components:

![image](https://user-images.githubusercontent.com/210413/68968163-8b867880-07a7-11ea-84e1-73fd49c39584.png)

> The best way to provide injected instances is via the constructor (or function arguments).

Traditionally, developers interested in using an instance of ContactsFacade must 1st prepare instances of ContactsService and ContactsStore. Those instances are passed as construction arguments to ContactsFacade.

![](https://i.imgur.com/Q4AJffU.png)

After construction, developers interested in **sharing the same instance** of a service or data model must consider how those instances will be cached, shared, and accessed.

<br/>

### Dependency Injection in React

React provides a Context as a way to pass data through the component tree without having to pass props down manually at every level. This allows deep child components to easily lookup services (using `Context.Consumer`)... services that were previously provided higher in the DOM tree (using `Context.Provider`). 

> IMO, these constructs also clutter the HTML markup and the DOM tree.

`useContext()` also provides programmatic lookups to services registered higher **up** the view hierarchy.

Seasonsed developers may even consider Higher-Order Functions (HoF) to encapsulate configuration information (or services) that will be needed for future (deep-tree) use.

Unfortunately, none of these provide a true _dependency injection_ infrastructure nor address the true intent of DI. 

* These ^ approaches do not address the goals of automating construction and decoupling dependencies.
* Nor do those solutions address the issues of how to test with mocks, etc. 

A dependency injection system easily solves these issue!

<br/>

### Requirements for Universal Dependency Injection

A robust dependency injection (DI) system allows provides the following features to developers.

![](https://i.imgur.com/GmLLzvB.png)

<br/>

**Question**: "How can we build a framework-agnostic DI system that can be used in React or raw JavaScript/TypeScript applications?" 

A more universal solution will require the following features:

* Support construction & lookups using tokens
* Configure the DI system for custom application requirements
* Provide an easy way to access singleton (shared) instances
* Provide an easy way to create a non-shared, localized instance
* Provide an easy way to override/replace existing configurations
* Provide an easy way to extend existing configurations

</br>

### Using DI Tokens

Dependency injection uses a lookup process to determine HOW to create an object.

![](https://i.imgur.com/k3SEGWc.png)


Using the concept of **`Provider`**(s) featured and [documented in Angular](https://angular.io/guide/architecture-services), we can implement a platform-independent approach:

![](https://i.imgur.com/JKXGBiH.png)

The Token (`<token>`) itself is simply an *identifier* object used to lookup the cached object instance. In most cases, the token is a specific Class. Sometimes, however, a class reference is not possible. The `<token>` could be a

* Class
* string (not unique)
* InjectionToken

Developers should use an `InjectionToken` whenever the type you are injecting is not reified (does not have a runtime representation); such as when injecting an interface, callable type, array or parameterized type.

Above ^ we see that the `<token>` is used as a lookup for the associated *factory* methods that will be used to create those instance... and the token is also used as a lookup for an existing instance (which may be internally cached as a singleton).

> Developers should note the `deps:any[]` options that allow each factory to define subsequent dependencies that are needed for proper construction. (soon we will see how this is used)
 
<br/>


### Custom Configuring DI (for your needs):

If we consider [again] the ContactsFacade dependency tree:

![image](https://user-images.githubusercontent.com/210413/68968163-8b867880-07a7-11ea-84e1-73fd49c39584.png)

This construction process is non-trivial and requires a tree-like instantiation process. So how can one easily configure construction relationships to allow programmatic DI that can:

- easily be used at any view level
- supports singleton instances
- supports override (non-singleton) instances
- supports multiple DI providers
 
<br/>
 
We can easily build a custom **`injector`** instance using the **`makeInjector()`** factory. Below, we registered a set (1..n) of Contact **Provider** configurations to create a custom Contact *injector*. 

![image](https://user-images.githubusercontent.com/210413/68969239-1e281700-07aa-11ea-92a6-a2434d90c63a.png)

> The best part of the custom injector is that its on-demand (lazy) feature. When a developer uses `injector.get(<token>)`, the cache registry is first checked to see if the instance exists. If not, only then will the required factories be called to create and cache the instance.

<br/>

### DI with React Components

Using our custom injectors in the React View layer is trivial: we import and then use the `injector.get(<token>)` syntax!

![](https://i.imgur.com/QMv1m4l.png)


From the perspective of the ContactsList view component ^, the view is not concerned with the 'how', 'when', or 'where' the ContactsService was constructed or cached. 

Instead the view component is only interested in the USE of the ContactsService API.

<br/>

### Easy Testing with DI + Mocks

Consider an additional requirement to test the view component in isolation. This means testing will need to inject a fake or mock service ContactsService into the ContactsList view component. 

With DI, it is super easy to replace a 'real' provider with a 'mock' provider:

![](https://i.imgur.com/lS1OxSj.png)

With this replacement on lines 10 - 13 above, the existing Provider configurations (defined in `./contacts`) will be overridden. 

Future requests for an injected ContactsService instance will then deliver only a **mock** ContactsService.

<br/>

## Considerations

The astute reader will realize that both of the following are required to use this DI solution:

* `makeInjector()`, and 
* `import { injector } from '...`

These ^ are manual requirements since A DI system has **not been archtected within React** like it is in Angular!

This is a DI solution that can be used in **any** view component, at any view-depth, or within any (non-view) service! The manual part is a small investment of effort that yields **huge ROI** with true dependency injection.