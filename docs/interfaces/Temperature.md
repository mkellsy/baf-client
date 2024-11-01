[Big Ass Fans Client](../README.md) / Temperature

# Interface: Temperature

Defines a temperature sensor device.

## Extends

- `Temperature`

## Properties

### address

> **address**: `Address`

The href address of the device. This is mainly used for Lutron systems.

#### Inherited from

`TemperatureInterface.address`

***

### area

> **area**: `Area`

The area the device is in.

#### Inherited from

`TemperatureInterface.area`

***

### capabilities

> **capabilities**: `object`

The devices capibilities. This is a map of the fields that can be set
or read.

#### Index Signature

 \[`key`: `string`\]: `Capability`

#### Inherited from

`TemperatureInterface.capabilities`

***

### id

> **id**: `string`

The device's unique identifier.

#### Inherited from

`TemperatureInterface.id`

***

### log

> **log**: `ILogger`

A logger for the device. This will automatically print the devices name,
room and id.

#### Inherited from

`TemperatureInterface.log`

***

### manufacturer

> **manufacturer**: `string`

The device's manufacturer.

#### Inherited from

`TemperatureInterface.manufacturer`

***

### name

> **name**: `string`

The device's configured name.

#### Inherited from

`TemperatureInterface.name`

***

### room

> **room**: `string`

The device's configured room.

#### Inherited from

`TemperatureInterface.room`

***

### status

> **status**: `DeviceState`

The current state of the device.

#### Inherited from

`TemperatureInterface.status`

***

### type

> **type**: `DeviceType`

The device type.

#### Inherited from

`TemperatureInterface.type`

## Methods

### emit()

> **emit**(`event`, ...`payload`): `boolean`

Emits events for this device.

#### Parameters

• **event**: `string`

The event to emit.

• ...**payload**: `any`[]

The payload attached to the event.

#### Returns

`boolean`

#### Inherited from

`TemperatureInterface.emit`

***

### off()

> **off**(`event`?, `listener`?): `this`

Unbinds a listener to an event.

#### Parameters

• **event?**: `string`

The event to unbind from.

• **listener?**: `Function`

The listener to unbind.

#### Returns

`this`

#### Inherited from

`TemperatureInterface.off`

***

### on()

> **on**(`event`, `listener`): `this`

Binds a listener to an event.

#### Parameters

• **event**: `string`

The event to bind to.

• **listener**: `Function`

The listener to bind.

#### Returns

`this`

#### Inherited from

`TemperatureInterface.on`

***

### once()

> **once**(`event`, `listener`): `this`

Binds a, rone once listener to an event.

#### Parameters

• **event**: `string`

The event to bind to.

• **listener**: `Function`

The listener to bind.

#### Returns

`this`

#### Inherited from

`TemperatureInterface.once`

***

### set()

> **set**(`state`): `Promise`\<`void`\>

Controls the device.

#### Parameters

• **state**: `unknown`

#### Returns

`Promise`\<`void`\>

#### Inherited from

`TemperatureInterface.set`

***

### update()

> **update**(`status`): `void`

Recieves a state response from the connection and updates the device
state.

```js
sensor.update({ Temperature: 22.3 });
```

#### Parameters

• **status**: `AreaStatus`

The current device state.

#### Returns

`void`

#### Overrides

`TemperatureInterface.update`
