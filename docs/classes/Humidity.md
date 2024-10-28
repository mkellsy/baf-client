[Big Ass Fans Client](../README.md) / Humidity

# Class: Humidity

Defines a humidity sensor device.

## Extends

- [`Common`](Common.md)\<[`HumidityState`](../interfaces/HumidityState.md)\>

## Implements

- `Humidity`

## Constructors

### new Humidity()

> **new Humidity**(`connection`, `capabilities`): [`Humidity`](Humidity.md)

Creates a humidity sensor device.

```js
const sensor = new Humidity(connection, capabilities);
```

#### Parameters

• **connection**: [`Connection`](Connection.md)

The main connection to the device.

• **capabilities**: [`Capabilities`](../interfaces/Capabilities.md)

Device capabilities from discovery.

#### Returns

[`Humidity`](Humidity.md)

#### Overrides

[`Common`](Common.md).[`constructor`](Common.md#constructors)

## Properties

### connection

> `protected` **connection**: [`Connection`](Connection.md)

Stores the current connection of this device.

#### Inherited from

[`Common`](Common.md).[`connection`](Common.md#connection)

***

### fields

> `protected` **fields**: `Map`\<`string`, `Capability`\>

Contains a map of fields and the type of each field.

#### Inherited from

[`Common`](Common.md).[`fields`](Common.md#fields)

***

### initialized

> `protected` **initialized**: `boolean` = `false`

Stores if this device has been descovered and fully srtup.

#### Inherited from

[`Common`](Common.md).[`initialized`](Common.md#initialized)

***

### state

> `protected` **state**: [`HumidityState`](../interfaces/HumidityState.md)

Stores the current device state.

#### Inherited from

[`Common`](Common.md).[`state`](Common.md#state)

## Accessors

### address

> `get` **address**(): `Address`

The href address of the device (not used).

#### Returns

`Address`

The device's href address.

#### Implementation of

`Interfaces.Humidity.address`

#### Inherited from

[`Common`](Common.md).[`address`](Common.md#address)

***

### area

> `get` **area**(): `Area`

The area the device is in (not used).

#### Returns

`Area`

The device's area.

#### Implementation of

`Interfaces.Humidity.area`

#### Inherited from

[`Common`](Common.md).[`area`](Common.md#area)

***

### capabilities

> `get` **capabilities**(): `object`

The devices capibilities. This is a map of the fields that can be set
or read.

#### Returns

`object`

The device's capabilities.

#### Implementation of

`Interfaces.Humidity.capabilities`

#### Inherited from

[`Common`](Common.md).[`capabilities`](Common.md#capabilities)

***

### id

> `get` **id**(): `string`

The device's unique identifier.

#### Returns

`string`

The device id.

#### Implementation of

`Interfaces.Humidity.id`

#### Inherited from

[`Common`](Common.md).[`id`](Common.md#id)

***

### log

> `get` **log**(): `ILogger`

A logger for the device. This will automatically print the devices name,
room and id.

#### Returns

`ILogger`

A reference to the logger assigned to this device.

#### Implementation of

`Interfaces.Humidity.log`

#### Inherited from

[`Common`](Common.md).[`log`](Common.md#log)

***

### manufacturer

> `get` **manufacturer**(): `string`

The device's manufacturer.

#### Returns

`string`

The manufacturer.

#### Implementation of

`Interfaces.Humidity.manufacturer`

#### Inherited from

[`Common`](Common.md).[`manufacturer`](Common.md#manufacturer)

***

### name

> `get` **name**(): `string`

The device's configured name.

#### Returns

`string`

The device's configured name.

#### Implementation of

`Interfaces.Humidity.name`

#### Inherited from

[`Common`](Common.md).[`name`](Common.md#name)

***

### room

> `get` **room**(): `string`

The device's configured room (not supported).

#### Returns

`string`

The device's configured room.

#### Implementation of

`Interfaces.Humidity.room`

#### Inherited from

[`Common`](Common.md).[`room`](Common.md#room)

***

### status

> `get` **status**(): `STATE`

The current state of the device.

#### Returns

`STATE`

The device's state.

#### Implementation of

`Interfaces.Humidity.status`

#### Inherited from

[`Common`](Common.md).[`status`](Common.md#status)

***

### suffix

> `get` **suffix**(): `string`

The device's suffix.

#### Returns

`string`

The device's suffix.

#### Inherited from

[`Common`](Common.md).[`suffix`](Common.md#suffix)

***

### type

> `get` **type**(): `DeviceType`

The device type.

#### Returns

`DeviceType`

The device type.

#### Implementation of

`Interfaces.Humidity.type`

#### Inherited from

[`Common`](Common.md).[`type`](Common.md#type)

## Methods

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

• **EVENT** *extends* `"Action"` \| `"Update"`

#### Parameters

• **event**: `EVENT`

The name of the event being listened for.

• ...**args**: `Parameters`\<`object`\[`EVENT`\]\>

Payload as defined in the event map.

#### Returns

`boolean`

Returns `true` if the event had listeners, `false` otherwise.

#### Implementation of

`Interfaces.Humidity.emit`

#### Inherited from

[`Common`](Common.md).[`emit`](Common.md#emit)

***

### events()

> **events**(): (`string` \| `symbol`)[]

Returns an array listing the events for which the emitter has registered
listeners. The values in the array are of type `string` or `symbol`.

#### Returns

(`string` \| `symbol`)[]

Returns an array of events names.

#### Inherited from

[`Common`](Common.md).[`events`](Common.md#events)

***

### listeners()

> **listeners**\<`EVENT`\>(`event`): `object`\[`EVENT`\][]

Returns a copy of the array of listeners for the `event`.

#### Type Parameters

• **EVENT** *extends* `"Action"` \| `"Update"`

#### Parameters

• **event**: `EVENT`

The name of the event being listened for.

#### Returns

`object`\[`EVENT`\][]

Returns a copy of the array of listeners.

#### Inherited from

[`Common`](Common.md).[`listeners`](Common.md#listeners)

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

• **EVENT** *extends* `"Action"` \| `"Update"`

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

#### Implementation of

`Interfaces.Humidity.off`

#### Inherited from

[`Common`](Common.md).[`off`](Common.md#off)

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

• **EVENT** *extends* `"Action"` \| `"Update"`

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

#### Implementation of

`Interfaces.Humidity.on`

#### Inherited from

[`Common`](Common.md).[`on`](Common.md#on)

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

• **EVENT** *extends* `"Action"` \| `"Update"`

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

#### Implementation of

`Interfaces.Humidity.once`

#### Inherited from

[`Common`](Common.md).[`once`](Common.md#once)

***

### set()

> **set**(): `Promise`\<`void`\>

Controls this device (not supported).

#### Returns

`Promise`\<`void`\>

#### Implementation of

`Interfaces.Humidity.set`

***

### update()

> **update**(`status`): `void`

Recieves a state response from the connection and updates the device
state.

```js
sensor.update({ Humidity: 42.3 });
```

#### Parameters

• **status**: `AreaStatus`

The current device state.

#### Returns

`void`

#### Implementation of

`Interfaces.Humidity.update`
