# Big Ass Fans Client

Discovers and publishes Big Ass Fan controls.

## API

This client will automatically find and connect to any Big Ass Fan on your network. When devices are found they will be exposed via events.

```js
import * as Baf from "@mkellsy/baf-client";
import * as Interfaces from "@mkellsy/hap-device";

const location = Baf.connect();

location.on("Available", (devices: Interrface.Device[]): void => {
    // event fired when all devices are available
});

location.on("Update", (
    device: Interrface.Device,
    state: Interrface.DeviceState
): void => {
    // event fired when the device state updates
});
```

You can map devices once they become available.

```js
function onAvailable(devices: Interfaces.Device[]): void {
    for (const device of devices) {
        // interact with device
    }
};
```

This will send updates when states change.

```js
function onUpdate(
    device: Interfaces.Device,
    state: Interfaces.DeviceState
): void {
    // fetch device locally and update state
};
```

Once you have a reference to a device, you can control the device with the set function.

```js
device.set({
    state: "On",
    speed: 5,
    whoosh: "On",
    auto: "Off",
    eco: "On",
});
```
