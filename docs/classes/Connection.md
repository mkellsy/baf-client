[Big Ass Fans Client](../README.md) / Connection

# Class: Connection

Connects to a device with the provided ip address, id, name and model.

## Extends

- `EventEmitter`\<`object`\>

## Constructors

### new Connection()

> **new Connection**(`host`, `id`, `name`, `model`): [`Connection`](Connection.md)

Creates a new connection to a device.

```js
const connection = new Connection(
    "192.168.1.1",
    "12:34:65:78",
    "My Device",
    "Haiku"
);
```

#### Parameters

• **host**: `string`

The ip address of the device.

• **id**: `string`

The id of the device.

• **name**: `string`

The name of the device.

• **model**: `string`

The model of the device.

#### Returns

[`Connection`](Connection.md)

#### Overrides

`EventEmitter<{
    Connect: (connection: Connection) => void;
    Disconnect: () => void;
    Response: <K extends keyof ResponseTypes>(type: K, response: ResponseTypes[K]) => void;
    Error: (error: Error) => void;
}>.constructor`

## Accessors

### id

> `get` **id**(): `string`

The id of the device.

#### Returns

`string`

The id of the device.

## Methods

### connect()

> **connect**(): `Promise`\<`void`\>

Asyncronously connects to a device.

```js
await connection.connect();
```

#### Returns

`Promise`\<`void`\>

***

### disconnect()

> **disconnect**(): `void`

Disconnects from a device.

```js
connection.disconnect();
```

#### Returns

`void`

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

• **EVENT** *extends* `"Connect"` \| `"Disconnect"` \| `"Response"` \| `"Error"`

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

***

### listeners()

> **listeners**\<`EVENT`\>(`event`): `object`\[`EVENT`\][]

Returns a copy of the array of listeners for the `event`.

#### Type Parameters

• **EVENT** *extends* `"Connect"` \| `"Disconnect"` \| `"Response"` \| `"Error"`

#### Parameters

• **event**: `EVENT`

The name of the event being listened for.

#### Returns

`object`\[`EVENT`\][]

Returns a copy of the array of listeners.

#### Inherited from

`EventEmitter.listeners`

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

• **EVENT** *extends* `"Connect"` \| `"Disconnect"` \| `"Response"` \| `"Error"`

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

• **EVENT** *extends* `"Connect"` \| `"Disconnect"` \| `"Response"` \| `"Error"`

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

• **EVENT** *extends* `"Connect"` \| `"Disconnect"` \| `"Response"` \| `"Error"`

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

***

### write()

> **write**(`buffer`): `Promise`\<`void`\>

Writes a command to a device.

```js
connection.write([0x01, 0x02, 0x03]);
```

#### Parameters

• **buffer**: `number`[]

The command as a hex number array.

#### Returns

`Promise`\<`void`\>

***

### reachable()

> `static` **reachable**(`host`): `Promise`\<`boolean`\>

Detects if a host is reachable.

#### Parameters

• **host**: `string`

Address of the device.

#### Returns

`Promise`\<`boolean`\>

True if the device is rechable, false if not.
