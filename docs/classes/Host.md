[Big Ass Fans Client](../README.md) / Host

# Class: Host

Creates an object that represents a single location, with a single network.

## Extends

- `EventEmitter`\<`object`\>

## Constructors

### new Host()

> **new Host**(): [`Host`](Host.md)

Creates a location object and starts mDNS discovery.

```js
const location = new Host();

location.on("Avaliable", (devices: Device[]) => {  });
```

#### Returns

[`Host`](Host.md)

#### Overrides

`EventEmitter<{
    Available: (devices: Interfaces.Device[]) => void;
    Message: (response: Response) => void;
    Update: (device: Interfaces.Device, state: Interfaces.DeviceState) => void;
}>.constructor`

#### Defined in

[src/Host.ts:49](https://github.com/mkellsy/baf-client/blob/289367c3ef8fe75588d41eda9372734a1c23f3c8/src/Host.ts#L49)

## Methods

### close()

> **close**(): `void`

Closes all connections for a location and stops searching.

#### Returns

`void`

#### Defined in

[src/Host.ts:60](https://github.com/mkellsy/baf-client/blob/289367c3ef8fe75588d41eda9372734a1c23f3c8/src/Host.ts#L60)

***

### emit()

> **emit**\<`EVENT`\>(`event`, ...`args`): `boolean`

Synchronously calls each of the listeners registered for the event named
`event`, in the order they were registered, passing the supplied
arguments to each.

```js
eventEmitter.emit("Response", {
    Headers: new Headers(),
    Body: "string response",
});
```

#### Type Parameters

• **EVENT** *extends* `"Update"` \| `"Available"` \| `"Message"`

#### Parameters

• **event**: `EVENT`

The name of the event being listened for.

• ...**args**: `Parameters`\<`object`\[`EVENT`\]\>

Payload as defined in the event map.

#### Returns

`boolean`

Returns `true` if the event had listeners, `false` otherwise.

#### Inherited from

`EventEmitter.emit`

#### Defined in

node\_modules/@mkellsy/event-emitter/lib/EventEmitter.d.ts:119

***

### events()

> **events**(): (`string` \| `symbol`)[]

Returns an array listing the events for which the emitter has registered
listeners. The values in the array are of type `string` or `symbol`.

#### Returns

(`string` \| `symbol`)[]

Returns an array of events names.

#### Inherited from

`EventEmitter.events`

#### Defined in

node\_modules/@mkellsy/event-emitter/lib/EventEmitter.d.ts:133

***

### listeners()

> **listeners**\<`EVENT`\>(`event`): `object`\[`EVENT`\][]

Returns a copy of the array of listeners for the `event`.

#### Type Parameters

• **EVENT** *extends* `"Update"` \| `"Available"` \| `"Message"`

#### Parameters

• **event**: `EVENT`

The name of the event being listened for.

#### Returns

`object`\[`EVENT`\][]

Returns a copy of the array of listeners.

#### Inherited from

`EventEmitter.listeners`

#### Defined in

node\_modules/@mkellsy/event-emitter/lib/EventEmitter.d.ts:126

***

### off()

> **off**\<`EVENT`\>(`event`?, `listener`?): `this`

Removes all listeners or the specified `event` and `listener` from the listener
array for the event named `event`.

It is bad practice to remove listeners added elsewhere in the code,
particularly when the `EventEmitter` instance was created by some other
component or module (e.g. sockets or file streams).

```js
const printResponse = (payload) => {
    console.log(payload.Body);
}

eventEmitter.on("Response", printResponse);
eventEmitter.off("Response", printResponse);
```

#### Type Parameters

• **EVENT** *extends* `"Update"` \| `"Available"` \| `"Message"`

#### Parameters

• **event?**: `EVENT`

(optional) The name of the event being listened for.

• **listener?**: `object`\[`EVENT`\]

(optional) The callback function. Default will remove
                all listeners for the event.

#### Returns

`this`

Returns a reference to the `EventEmitter`, so that calls can be
         chained.

#### Inherited from

`EventEmitter.off`

#### Defined in

node\_modules/@mkellsy/event-emitter/lib/EventEmitter.d.ts:102

***

### on()

> **on**\<`EVENT`\>(`event`, `listener`, `prepend`?): `this`

Adds the `listener` function to the end of the listeners array for the
event named `event`. No checks are made to see if the `listener` has
already been added. Multiple calls passing the same combination of
`event`and `listener` will result in the `listener` being added, and
called, multiple times.

```js
eventEmitter.on("Response", (payload) => {
    console.log(payload.Body);
});
```

#### Type Parameters

• **EVENT** *extends* `"Update"` \| `"Available"` \| `"Message"`

#### Parameters

• **event**: `EVENT`

The name of the event being listened for.

• **listener**: `object`\[`EVENT`\]

The callback function.

• **prepend?**: `boolean`

(optional) Add the callback to the begining of the call
               stack.

#### Returns

`this`

Returns a reference to the `EventEmitter`, so that calls can be
         chained.

#### Inherited from

`EventEmitter.on`

#### Defined in

node\_modules/@mkellsy/event-emitter/lib/EventEmitter.d.ts:59

***

### once()

> **once**\<`EVENT`\>(`event`, `listener`, `prepend`?): `this`

Adds a **one-time** `listener` function for the event named `event`. The
next time `event` is triggered, this listener is removed and then
invoked.

```js
eventEmitter.once("Response", (payload) => {
    console.log(payload.Body);
});
```

#### Type Parameters

• **EVENT** *extends* `"Update"` \| `"Available"` \| `"Message"`

#### Parameters

• **event**: `EVENT`

The name of the event being listened for.

• **listener**: `object`\[`EVENT`\]

The callback function.

• **prepend?**: `boolean`

(optional) Add the callback to the begining of the call
               stack.

#### Returns

`this`

Returns a reference to the `EventEmitter`, so that calls can be
         chained.

#### Inherited from

`EventEmitter.once`

#### Defined in

node\_modules/@mkellsy/event-emitter/lib/EventEmitter.d.ts:78
