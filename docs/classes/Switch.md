[Big Ass Fans Client](../README.md) / Switch

# Class: Switch

Defines a on/off switch device.

## Extends

- [`Common`](Common.md)\<[`SwitchState`](../interfaces/SwitchState.md)\>

## Implements

- `Switch`

## Constructors

### new Switch()

> **new Switch**(`connection`, `capabilities`, `type`): [`Switch`](Switch.md)

Creates a dimmable light device.

```js
const switch = new Switch(connection, capabilities, DeviceType.UVC);
```

#### Parameters

• **connection**: [`Connection`](Connection.md)

The main connection to the device.

• **capabilities**: [`Capabilities`](../interfaces/Capabilities.md)

Device capabilities from discovery.

• **type**: [`DeviceType`](../enumerations/DeviceType.md)

The device type to tell the difference from a light and uvc.

#### Returns

[`Switch`](Switch.md)

#### Overrides

[`Common`](Common.md).[`constructor`](Common.md#constructors)

#### Defined in

[src/Devices/Switch.ts:28](https://github.com/mkellsy/baf-client/blob/b1857d963b07500d6d708a4c8106cad07d63cfc0/src/Devices/Switch.ts#L28)

## Properties

### connection

> `protected` **connection**: [`Connection`](Connection.md)

Stores the current connection of this device.

#### Inherited from

[`Common`](Common.md).[`connection`](Common.md#connection)

#### Defined in

[src/Devices/Common.ts:21](https://github.com/mkellsy/baf-client/blob/b1857d963b07500d6d708a4c8106cad07d63cfc0/src/Devices/Common.ts#L21)

***

### fields

> `protected` **fields**: `Map`\<`string`, `Capability`\>

Contains a map of fields and the type of each field.

#### Inherited from

[`Common`](Common.md).[`fields`](Common.md#fields)

#### Defined in

[src/Devices/Common.ts:36](https://github.com/mkellsy/baf-client/blob/b1857d963b07500d6d708a4c8106cad07d63cfc0/src/Devices/Common.ts#L36)

***

### initialized

> `protected` **initialized**: `boolean` = `false`

Stores if this device has been descovered and fully srtup.

#### Inherited from

[`Common`](Common.md).[`initialized`](Common.md#initialized)

#### Defined in

[src/Devices/Common.ts:31](https://github.com/mkellsy/baf-client/blob/b1857d963b07500d6d708a4c8106cad07d63cfc0/src/Devices/Common.ts#L31)

***

### state

> `protected` **state**: [`SwitchState`](../interfaces/SwitchState.md)

Stores the current device state.

#### Inherited from

[`Common`](Common.md).[`state`](Common.md#state)

#### Defined in

[src/Devices/Common.ts:26](https://github.com/mkellsy/baf-client/blob/b1857d963b07500d6d708a4c8106cad07d63cfc0/src/Devices/Common.ts#L26)

## Accessors

### address

> `get` **address**(): `Address`

The href address of the device (not used).

#### Returns

`Address`

The device's href address.

#### Implementation of

`Interfaces.Switch.address`

#### Inherited from

[`Common`](Common.md).[`address`](Common.md#address)

#### Defined in

[src/Devices/Common.ts:141](https://github.com/mkellsy/baf-client/blob/b1857d963b07500d6d708a4c8106cad07d63cfc0/src/Devices/Common.ts#L141)

***

### area

> `get` **area**(): `Area`

The area the device is in (not used).

#### Returns

`Area`

The device's area.

#### Implementation of

`Interfaces.Switch.area`

#### Inherited from

[`Common`](Common.md).[`area`](Common.md#area)

#### Defined in

[src/Devices/Common.ts:168](https://github.com/mkellsy/baf-client/blob/b1857d963b07500d6d708a4c8106cad07d63cfc0/src/Devices/Common.ts#L168)

***

### capabilities

> `get` **capabilities**(): `object`

The devices capibilities. This is a map of the fields that can be set
or read.

#### Returns

`object`

The device's capabilities.

#### Implementation of

`Interfaces.Switch.capabilities`

#### Inherited from

[`Common`](Common.md).[`capabilities`](Common.md#capabilities)

#### Defined in

[src/Devices/Common.ts:122](https://github.com/mkellsy/baf-client/blob/b1857d963b07500d6d708a4c8106cad07d63cfc0/src/Devices/Common.ts#L122)

***

### id

> `get` **id**(): `string`

The device's unique identifier.

#### Returns

`string`

The device id.

#### Implementation of

`Interfaces.Switch.id`

#### Inherited from

[`Common`](Common.md).[`id`](Common.md#id)

#### Defined in

[src/Devices/Common.ts:94](https://github.com/mkellsy/baf-client/blob/b1857d963b07500d6d708a4c8106cad07d63cfc0/src/Devices/Common.ts#L94)

***

### log

> `get` **log**(): `ILogger`

A logger for the device. This will automatically print the devices name,
room and id.

#### Returns

`ILogger`

A reference to the logger assigned to this device.

#### Implementation of

`Interfaces.Switch.log`

#### Inherited from

[`Common`](Common.md).[`log`](Common.md#log)

#### Defined in

[src/Devices/Common.ts:132](https://github.com/mkellsy/baf-client/blob/b1857d963b07500d6d708a4c8106cad07d63cfc0/src/Devices/Common.ts#L132)

***

### manufacturer

> `get` **manufacturer**(): `string`

The device's manufacturer.

#### Returns

`string`

The manufacturer.

#### Implementation of

`Interfaces.Switch.manufacturer`

#### Inherited from

[`Common`](Common.md).[`manufacturer`](Common.md#manufacturer)

#### Defined in

[src/Devices/Common.ts:85](https://github.com/mkellsy/baf-client/blob/b1857d963b07500d6d708a4c8106cad07d63cfc0/src/Devices/Common.ts#L85)

***

### name

> `get` **name**(): `string`

The device's configured name.

#### Returns

`string`

The device's configured name.

#### Implementation of

`Interfaces.Switch.name`

#### Inherited from

[`Common`](Common.md).[`name`](Common.md#name)

#### Defined in

[src/Devices/Common.ts:103](https://github.com/mkellsy/baf-client/blob/b1857d963b07500d6d708a4c8106cad07d63cfc0/src/Devices/Common.ts#L103)

***

### room

> `get` **room**(): `string`

The device's configured room (not supported).

#### Returns

`string`

The device's configured room.

#### Implementation of

`Interfaces.Switch.room`

#### Inherited from

[`Common`](Common.md).[`room`](Common.md#room)

#### Defined in

[src/Devices/Common.ts:112](https://github.com/mkellsy/baf-client/blob/b1857d963b07500d6d708a4c8106cad07d63cfc0/src/Devices/Common.ts#L112)

***

### status

> `get` **status**(): `STATE`

The current state of the device.

#### Returns

`STATE`

The device's state.

#### Implementation of

`Interfaces.Switch.status`

#### Inherited from

[`Common`](Common.md).[`status`](Common.md#status)

#### Defined in

[src/Devices/Common.ts:186](https://github.com/mkellsy/baf-client/blob/b1857d963b07500d6d708a4c8106cad07d63cfc0/src/Devices/Common.ts#L186)

***

### suffix

> `get` **suffix**(): `string`

The device's suffix.

#### Returns

`string`

The device's suffix.

#### Inherited from

[`Common`](Common.md).[`suffix`](Common.md#suffix)

#### Defined in

[src/Devices/Common.ts:150](https://github.com/mkellsy/baf-client/blob/b1857d963b07500d6d708a4c8106cad07d63cfc0/src/Devices/Common.ts#L150)

***

### type

> `get` **type**(): `DeviceType`

The device type.

#### Returns

`DeviceType`

The device type.

#### Implementation of

`Interfaces.Switch.type`

#### Inherited from

[`Common`](Common.md).[`type`](Common.md#type)

#### Defined in

[src/Devices/Common.ts:159](https://github.com/mkellsy/baf-client/blob/b1857d963b07500d6d708a4c8106cad07d63cfc0/src/Devices/Common.ts#L159)

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

`Interfaces.Switch.emit`

#### Inherited from

[`Common`](Common.md).[`emit`](Common.md#emit)

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

[`Common`](Common.md).[`events`](Common.md#events)

#### Defined in

node\_modules/@mkellsy/event-emitter/lib/EventEmitter.d.ts:133

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

`Interfaces.Switch.off`

#### Inherited from

[`Common`](Common.md).[`off`](Common.md#off)

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

`Interfaces.Switch.on`

#### Inherited from

[`Common`](Common.md).[`on`](Common.md#on)

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

`Interfaces.Switch.once`

#### Inherited from

[`Common`](Common.md).[`once`](Common.md#once)

#### Defined in

node\_modules/@mkellsy/event-emitter/lib/EventEmitter.d.ts:78

***

### set()

> **set**(`status`): `Promise`\<`void`\>

Controls this device.

```js
switch.set({ state: "On" });
```

#### Parameters

• **status**: [`SwitchState`](../interfaces/SwitchState.md)

Desired device state.

#### Returns

`Promise`\<`void`\>

#### Implementation of

`Interfaces.Switch.set`

#### Defined in

[src/Devices/Switch.ts:76](https://github.com/mkellsy/baf-client/blob/b1857d963b07500d6d708a4c8106cad07d63cfc0/src/Devices/Switch.ts#L76)

***

### update()

> **update**(`status`): `void`

Recieves a state response from the connection and updates the device
state.

```js
switch.update({ SwitchedLevel: "On" });
```

#### Parameters

• **status**: `ZoneStatus`

The current device state.

#### Returns

`void`

#### Implementation of

`Interfaces.Switch.update`

#### Defined in

[src/Devices/Switch.ts:53](https://github.com/mkellsy/baf-client/blob/b1857d963b07500d6d708a4c8106cad07d63cfc0/src/Devices/Switch.ts#L53)
