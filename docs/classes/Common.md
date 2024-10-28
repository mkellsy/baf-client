[Big Ass Fans Client](../README.md) / Common

# Class: `abstract` Common\<STATE\>

Defines common functionallity for a device.

## Extends

- `EventEmitter`\<`object`\>

## Extended by

- [`Dimmer`](Dimmer.md)
- [`Fan`](Fan.md)
- [`Humidity`](Humidity.md)
- [`Occupancy`](Occupancy.md)
- [`Switch`](Switch.md)
- [`Temperature`](Temperature.md)

## Type Parameters

• **STATE** *extends* `Interfaces.DeviceState`

## Constructors

### new Common()

> **new Common**\<`STATE`\>(`type`, `connection`, `definition`, `state`): [`Common`](Common.md)\<`STATE`\>

Creates a base device object.

```js
class Fan extends Common {
    constructor(id: string, connection: Connection, name: string) {
        super(DeviceType.Fan, connection, { id, name, "Fan" });

        // Device specific code
    }
}
```

#### Parameters

• **type**: `DeviceType`

The device type.

• **connection**: [`Connection`](Connection.md)

The main connection.

• **definition**

The definition object containing id, name and suffix.

• **definition.id**: `string`

• **definition.name**: `string`

• **definition.suffix**: `string`

• **state**: `STATE`

#### Returns

[`Common`](Common.md)\<`STATE`\>

#### Overrides

`EventEmitter<{
    Action: (device: Interfaces.Device, button: Interfaces.Button, action: Interfaces.Action) => void;
    Update: (device: Interfaces.Device, state: STATE) => void;
}>.constructor`

#### Defined in

[src/Devices/Common.ts:62](https://github.com/mkellsy/baf-client/blob/289367c3ef8fe75588d41eda9372734a1c23f3c8/src/Devices/Common.ts#L62)

## Properties

### connection

> `protected` **connection**: [`Connection`](Connection.md)

Stores the current connection of this device.

#### Defined in

[src/Devices/Common.ts:21](https://github.com/mkellsy/baf-client/blob/289367c3ef8fe75588d41eda9372734a1c23f3c8/src/Devices/Common.ts#L21)

***

### fields

> `protected` **fields**: `Map`\<`string`, `Capability`\>

Contains a map of fields and the type of each field.

#### Defined in

[src/Devices/Common.ts:36](https://github.com/mkellsy/baf-client/blob/289367c3ef8fe75588d41eda9372734a1c23f3c8/src/Devices/Common.ts#L36)

***

### initialized

> `protected` **initialized**: `boolean` = `false`

Stores if this device has been descovered and fully srtup.

#### Defined in

[src/Devices/Common.ts:31](https://github.com/mkellsy/baf-client/blob/289367c3ef8fe75588d41eda9372734a1c23f3c8/src/Devices/Common.ts#L31)

***

### state

> `protected` **state**: `STATE`

Stores the current device state.

#### Defined in

[src/Devices/Common.ts:26](https://github.com/mkellsy/baf-client/blob/289367c3ef8fe75588d41eda9372734a1c23f3c8/src/Devices/Common.ts#L26)

## Accessors

### address

> `get` **address**(): `Address`

The href address of the device (not used).

#### Returns

`Address`

The device's href address.

#### Defined in

[src/Devices/Common.ts:141](https://github.com/mkellsy/baf-client/blob/289367c3ef8fe75588d41eda9372734a1c23f3c8/src/Devices/Common.ts#L141)

***

### area

> `get` **area**(): `Area`

The area the device is in (not used).

#### Returns

`Area`

The device's area.

#### Defined in

[src/Devices/Common.ts:168](https://github.com/mkellsy/baf-client/blob/289367c3ef8fe75588d41eda9372734a1c23f3c8/src/Devices/Common.ts#L168)

***

### capabilities

> `get` **capabilities**(): `object`

The devices capibilities. This is a map of the fields that can be set
or read.

#### Returns

`object`

The device's capabilities.

#### Defined in

[src/Devices/Common.ts:122](https://github.com/mkellsy/baf-client/blob/289367c3ef8fe75588d41eda9372734a1c23f3c8/src/Devices/Common.ts#L122)

***

### id

> `get` **id**(): `string`

The device's unique identifier.

#### Returns

`string`

The device id.

#### Defined in

[src/Devices/Common.ts:94](https://github.com/mkellsy/baf-client/blob/289367c3ef8fe75588d41eda9372734a1c23f3c8/src/Devices/Common.ts#L94)

***

### log

> `get` **log**(): `ILogger`

A logger for the device. This will automatically print the devices name,
room and id.

#### Returns

`ILogger`

A reference to the logger assigned to this device.

#### Defined in

[src/Devices/Common.ts:132](https://github.com/mkellsy/baf-client/blob/289367c3ef8fe75588d41eda9372734a1c23f3c8/src/Devices/Common.ts#L132)

***

### manufacturer

> `get` **manufacturer**(): `string`

The device's manufacturer.

#### Returns

`string`

The manufacturer.

#### Defined in

[src/Devices/Common.ts:85](https://github.com/mkellsy/baf-client/blob/289367c3ef8fe75588d41eda9372734a1c23f3c8/src/Devices/Common.ts#L85)

***

### name

> `get` **name**(): `string`

The device's configured name.

#### Returns

`string`

The device's configured name.

#### Defined in

[src/Devices/Common.ts:103](https://github.com/mkellsy/baf-client/blob/289367c3ef8fe75588d41eda9372734a1c23f3c8/src/Devices/Common.ts#L103)

***

### room

> `get` **room**(): `string`

The device's configured room (not supported).

#### Returns

`string`

The device's configured room.

#### Defined in

[src/Devices/Common.ts:112](https://github.com/mkellsy/baf-client/blob/289367c3ef8fe75588d41eda9372734a1c23f3c8/src/Devices/Common.ts#L112)

***

### status

> `get` **status**(): `STATE`

The current state of the device.

#### Returns

`STATE`

The device's state.

#### Defined in

[src/Devices/Common.ts:186](https://github.com/mkellsy/baf-client/blob/289367c3ef8fe75588d41eda9372734a1c23f3c8/src/Devices/Common.ts#L186)

***

### suffix

> `get` **suffix**(): `string`

The device's suffix.

#### Returns

`string`

The device's suffix.

#### Defined in

[src/Devices/Common.ts:150](https://github.com/mkellsy/baf-client/blob/289367c3ef8fe75588d41eda9372734a1c23f3c8/src/Devices/Common.ts#L150)

***

### type

> `get` **type**(): `DeviceType`

The device type.

#### Returns

`DeviceType`

The device type.

#### Defined in

[src/Devices/Common.ts:159](https://github.com/mkellsy/baf-client/blob/289367c3ef8fe75588d41eda9372734a1c23f3c8/src/Devices/Common.ts#L159)

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

• **EVENT** *extends* `"Action"` \| `"Update"`

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

#### Inherited from

`EventEmitter.once`

#### Defined in

node\_modules/@mkellsy/event-emitter/lib/EventEmitter.d.ts:78
