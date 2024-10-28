[Big Ass Fans Client](../README.md) / FanState

# Interface: FanState

Defines a fan's current status response.

## Extends

- `DeviceState`

## Properties

### eco?

> `optional` **eco**: `"On"` \| `"Off"`

Determines if the fan's eco mode is on or off.

#### Defined in

[src/Devices/FanState.ts:26](https://github.com/mkellsy/baf-client/blob/289367c3ef8fe75588d41eda9372734a1c23f3c8/src/Devices/FanState.ts#L26)

***

### speed

> **speed**: `number`

The fan's speed setting.

#### Defined in

[src/Devices/FanState.ts:16](https://github.com/mkellsy/baf-client/blob/289367c3ef8fe75588d41eda9372734a1c23f3c8/src/Devices/FanState.ts#L16)

***

### state

> **state**: `"On"` \| `"Off"` \| `"Auto"`

Is the fan on, off, or set to auto.

#### Overrides

`DeviceState.state`

#### Defined in

[src/Devices/FanState.ts:11](https://github.com/mkellsy/baf-client/blob/289367c3ef8fe75588d41eda9372734a1c23f3c8/src/Devices/FanState.ts#L11)

***

### whoosh

> **whoosh**: `"On"` \| `"Off"`

Determines if the fan's whoosh mode is on or off.

#### Defined in

[src/Devices/FanState.ts:21](https://github.com/mkellsy/baf-client/blob/289367c3ef8fe75588d41eda9372734a1c23f3c8/src/Devices/FanState.ts#L21)