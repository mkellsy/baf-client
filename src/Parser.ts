export abstract class Parser {
    private static fragment: Buffer = Buffer.alloc(0);

    /**
     * Converts a number array to a hex binary array.
     *
     * ```js
     * const stuffed = Parser.stuff([0x00, 0x01, 0x02]);
     * ```
     *
     * @param data A hex number array.
     *
     * @returns An array of numbers.
     */
    public static stuff(data: number[]): number[] {
        const result: number[] = [];

        let index = 0;

        for (let i = 0; i < data.length; i++) {
            if (data[i] === 0xc0) {
                result[index++] = 0xdb;
                result[index++] = 0xdc;
            } else if (data[i] === 0xdb) {
                result[index++] = 0xdb;
                result[index++] = 0xdd;
            } else {
                result[index++] = data[i];
            }
        }

        return result;
    }

    /**
     * Converts a binary buffer from the device to a hex number array.
     *
     * ```js
     * const unstuffed = Parser.unstuff(
     *     Buffer.from([0x00, 0x01, 0x02])
     * );
     * ```
     *
     * @param data A binary buffer.
     *
     * @returns A hex buffer array.
     */
    public static unstuff(data: Buffer): Buffer {
        const result: number[] = [];

        let index = 0;
        let position = 0;

        while (index < data.length) {
            if (data[index] === 0xdb && data[index + 1] === 0xdc) {
                result[position++] = 0xc0;

                index += 2;
            } else if (data[index] === 0xdb && data[index + 1] === 0xdd) {
                result[position++] = 0xdb;

                index += 2;
            } else {
                result[position++] = data[index++];
            }
        }

        return Buffer.from(result);
    }

    /**
     * Combines seperate chunked messages from the device into a single object.
     *
     * ```js
     * const fragments = Parser.chunkify(
     *     Buffer.from([0x00, 0x01, 0x02])
     * );
     * ```
     *
     * @param data A binary buffer from the device.
     *
     * @returns An object containing the chunks and a count.
     */
    public static chunkify(data: Buffer): { chunks: Buffer[]; count: number } {
        let index = 0;
        let count = 0;

        const chunks: Buffer[] = [];

        if (data[0] !== 0xc0 || (data[0] === 0xc0 && data[1] === 0xc0)) {
            index = data.indexOf(0xc0) + 1;

            if (Parser.fragment.length > 0) {
                const arr = [Parser.fragment, data.subarray(0, index)];

                chunks[count] = Buffer.concat(arr);

                count++;
            }
        }

        let eof = 0;
        let started = false;

        for (let i = index; i < data.length; i++) {
            if (data[i] === 0xc0) {
                if (!started) {
                    started = true;
                    index = i;
                } else {
                    chunks[count] = data.subarray(index, i + 1);

                    count++;
                    started = false;
                    eof = i;
                }
            }
        }

        if (eof < data.length - 1) {
            Parser.fragment = data.subarray(eof + 1);
        } else {
            Parser.fragment = Buffer.from([]);
        }

        return { chunks, count };
    }

    /**
     * Reads in a hex buffer array from the device and translates it into a
     * response payload.
     *
     * ```js
     * const response = Parser.parse(
     *     Buffer.from([0x00, 0x01, 0x02])
     * ) as FanState;
     * ```
     *
     * @param data A binary buffer, unstuffed.
     *
     * @returns An object that can be casted into a response type interface.
     */
    public static parse(data: Buffer): Record<string, any> {
        let type: number;
        let field: number;
        let length: number;

        let alpha: string;
        let numeric: number;

        let remaining: number;

        const results: Record<string, any> = {};

        [data, type, field] = Parser.deconstruct(data);

        if (field === 2) {
            [data, length] = Parser.varint(data);
            [data, type, field] = Parser.deconstruct(data);

            while (data.length > 0) {
                if (field === 4) {
                    [data, length] = Parser.varint(data);

                    remaining = data.length - length;

                    while (data.length > remaining) {
                        [data, type, field] = Parser.deconstruct(data);

                        /* istanbul ignore else */
                        if (field === 2) {
                            [data, length] = Parser.varint(data);
                            [data, type, field] = Parser.deconstruct(data);

                            switch (field) {
                                case 43: // fan on/auto state
                                    [data, numeric] = Parser.getValue(data);

                                    results.fan = { ...results.fan };

                                    results.fan.state = {
                                        ...results.fan.state,
                                        on: numeric >= 1,
                                        auto: numeric === 2,
                                    };

                                    break;

                                case 44: // fan reverse state
                                    [data, numeric] = Parser.getValue(data);

                                    results.fan = { ...results.fan };

                                    results.fan.state = {
                                        ...results.fan.state,
                                        reverse: numeric === 1,
                                    };

                                    break;

                                case 46: // fan rotation speed state
                                    [data, numeric] = Parser.getValue(data);

                                    results.fan = { ...results.fan };

                                    results.fan.state = {
                                        ...results.fan.state,
                                        speed: numeric,
                                    };

                                    break;

                                case 58: // fan whoosh state
                                    [data, numeric] = Parser.getValue(data);

                                    results.fan = { ...results.fan };

                                    results.fan.state = {
                                        ...results.fan.state,
                                        whoosh: numeric === 1,
                                    };

                                    break;

                                case 65: // fan eco mode state
                                    [data, numeric] = Parser.getValue(data);

                                    results.fan = { ...results.fan };

                                    results.fan.state = {
                                        ...results.fan.state,
                                        eco: numeric === 1,
                                    };

                                    break;

                                case 66: // fan occupancy state
                                    [data, numeric] = Parser.getValue(data);

                                    results.fan = { ...results.fan };

                                    results.fan.state = {
                                        ...results.fan.state,
                                        occupancy: numeric === 1,
                                    };

                                    break;

                                case 67: // fan on means auto
                                    [data, numeric] = Parser.getValue(data);
                                    break;

                                case 68: // light on/off/auto
                                    [data, numeric] = Parser.getValue(data);

                                    results.light = { ...results.light };

                                    results.light.state = {
                                        ...results.light.state,
                                        on: numeric >= 1,
                                        auto: numeric === 2,
                                    };

                                    break;

                                case 69: // light brightness
                                    [data, numeric] = Parser.getValue(data);

                                    results.light = { ...results.light };

                                    results.light.state = {
                                        ...results.light.state,
                                        level: numeric,
                                    };

                                    break;

                                case 71: // color temperature
                                    [data, numeric] = Parser.getValue(data);

                                    results.light = { ...results.light };

                                    results.light.state = {
                                        ...results.light.state,
                                        luminance: numeric,
                                    };

                                    break;

                                case 77: // light dim to warm
                                    [data, numeric] = Parser.getValue(data);

                                    results.light = { ...results.light };

                                    results.light.state = {
                                        ...results.light.state,
                                        warm: numeric,
                                    };

                                    break;

                                case 82: // light selector light mode 0/all, 1/downlight, 2/uplight
                                    [data, numeric] = Parser.getValue(data);

                                    results.light = {
                                        ...results.light,
                                        target: numeric === 2 ? "uplight" : "downlight",
                                    };

                                    break;

                                case 86: // temperature sensor state
                                    [data, numeric] = Parser.getValue(data);

                                    results.sensor = { ...results.sensor };

                                    results.sensor.state = {
                                        ...results.sensor.state,
                                        temperature: numeric / 100,
                                    };

                                    break;

                                case 87: // humidity sensor state
                                    [data, numeric] = Parser.getValue(data);

                                    results.sensor = { ...results.sensor };

                                    results.sensor.state = {
                                        ...results.sensor.state,
                                        humidity: numeric / 100,
                                    };

                                    break;

                                /* istanbul ignore next */
                                case 172: // uvc state
                                    [data, numeric] = Parser.getValue(data);

                                    results.light = { ...results.light };

                                    results.light = {
                                        ...results.light,
                                        target: "uvc",
                                        on: numeric >= 1,
                                    };

                                    break;

                                case 45: // fan speed as %
                                case 47: // fan auto comfort
                                case 48: // comfort ideal temperature
                                case 50: // comfort min speed
                                case 51: // comfort max speed
                                case 52: // fan auto -> motion -> motion sense switch (fan occupancy enable)
                                case 53: // fan auto -> motion -> motion timeout (time)
                                case 54: // fan return to auto (return to auto switch)
                                case 55: // fan return to auto (return to auto timeout)
                                case 60: // comfort heat assist
                                case 61: // comfort sense heat assist speed
                                case 62: // comfort sense heat assist direction
                                case 63: // target revolutions per minute
                                case 64: // actual rpm
                                case 70: // brightness as level (0, 1-16)
                                case 72: // light occupancy enabled
                                case 73: // light auto motion timeout (time)
                                case 74: // light return to auto (return to auto switch)
                                case 75: // light return to auto (return after)
                                case 78: // warmest color temperature
                                case 79: // coolest color temperature
                                case 95: // fan timer minutes
                                case 96: // fan timer UTC expiration
                                case 134: // LED indicators enabled
                                case 135: // audible indicator enabled
                                case 136: // legacy IR remote enabled
                                case 140: // assist 0/nothing, 1/heating, 2/cooling, 3/all
                                case 150: // remote discovery enabled
                                case 151: // external device count
                                case 153: // bluetooth remote supported
                                case 173: // uvc life
                                    [data, numeric] = Parser.getValue(data);
                                    break;

                                case 56:
                                case 59:
                                case 76:
                                    [data, alpha] = Parser.getString(data);
                                    break;

                                case 49:
                                case 57:
                                case 84:
                                case 89:
                                case 118:
                                case 121:
                                case 133:
                                case 137:
                                case 138:
                                case 174:
                                case 175:
                                    [data, numeric] = Parser.getValue(data);
                                    break;

                                case 16: // detailed version
                                    [data, length] = Parser.varint(data);

                                    remaining = data.length - length;

                                    while (data.length > remaining) {
                                        [data, type, field] = Parser.deconstruct(data);

                                        if (field === 2) {
                                            [data, alpha] = Parser.getString(data);

                                            results.software = alpha;
                                        }

                                        if (field === 3) {
                                            [data, alpha] = Parser.getString(data);

                                            results.firmware = alpha;
                                        }
                                    }

                                    break;

                                case 17: // capabilities
                                    [data, length] = Parser.varint(data);

                                    remaining = data.length - length;

                                    results.capabilities = {
                                        fan: false,
                                        downlight: false,
                                        uplight: false,
                                        temperature: false,
                                        humidity: false,
                                        occupancy: false,
                                        luminance: false,
                                        speaker: false,
                                        uvc: false,
                                        eco: false,
                                    };

                                    while (data.length > remaining) {
                                        [data, type, field] = Parser.deconstruct(data);

                                        switch (field) {
                                            case 1: // temperature sensor
                                                [data, numeric] = Parser.getValue(data);

                                                results.capabilities.temperature = Boolean(numeric);
                                                break;

                                            case 2: // humidity sensor
                                                [data, numeric] = Parser.getValue(data);

                                                results.capabilities.humidity = Boolean(numeric);
                                                break;

                                            case 3: // occupancy sensor
                                                [data, numeric] = Parser.getValue(data);

                                                results.capabilities.occupancy = Boolean(numeric);
                                                break;

                                            /* istanbul ignore next */
                                            case 4: // downlight
                                                [data, numeric] = Parser.getValue(data);

                                                results.capabilities.downlight = Boolean(numeric);
                                                break;

                                            /* istanbul ignore next */
                                            case 6: // luminance
                                                [data, numeric] = Parser.getValue(data);

                                                results.capabilities.luminance = Boolean(numeric);
                                                break;

                                            case 7: // fan
                                                [data, numeric] = Parser.getValue(data);

                                                results.capabilities.fan = Boolean(numeric);
                                                break;

                                            case 8: // speaker
                                                [data, numeric] = Parser.getValue(data);

                                                results.capabilities.speaker = Boolean(numeric);
                                                break;

                                            /* istanbul ignore next */
                                            case 11: // uplight
                                                [data, numeric] = Parser.getValue(data);

                                                results.capabilities.uplight = Boolean(numeric);
                                                break;

                                            /* istanbul ignore next */
                                            case 12: // uvc
                                                [data, numeric] = Parser.getValue(data);

                                                results.capabilities.uvc = Boolean(numeric);
                                                break;

                                            case 14: // eco
                                                [data, numeric] = Parser.getValue(data);

                                                results.capabilities.eco = Boolean(numeric);
                                                break;
                                        }
                                    }

                                    break;

                                case 83: // standby message: 1/color preset, 2/enabled, 3/percent, 4/red, 5/green, 6/blue
                                    [data, length] = Parser.varint(data);
                                    remaining = data.length - length;
                                    break;

                                case 152: // external device version
                                    [data, length] = Parser.varint(data);

                                    remaining = data.length - length;

                                    while (data.length > remaining) {
                                        [data, type, field] = Parser.deconstruct(data);

                                        if (field === 4) {
                                            [data, alpha] = Parser.getString(data);

                                            results.mac = alpha;
                                        }
                                    }

                                    break;

                                case 171:
                                    [data, length] = Parser.varint(data);

                                    remaining = data.length - length;
                                    data = Parser.advance(data, type);

                                    break;
                            }
                        }
                    }
                } else if (field === 5) {
                    [data, numeric] = Parser.getValue(data);
                } else if (field === 6) {
                    [data, alpha] = Parser.getString(data);
                } else {
                    data = Parser.advance(data, type);
                }

                if (data.length > 0) {
                    [data, type, field] = Parser.deconstruct(data);
                }
            }
        } else {
            data = Parser.advance(data, type);
        }

        return results;
    }

    /*
     * Fetches a string value from binary data.
     */
    private static getString(data: Buffer): [Buffer, string] {
        let length: number;

        [data, length] = Parser.varint(data);

        return [data.subarray(length), data.subarray(0, length).toString()];
    }

    /*
     * Fetches a numeric value from binary data.
     */
    private static getValue(data: Buffer): [Buffer, number] {
        let length: number;

        [data, length] = Parser.varint(data);

        return [data, length];
    }

    /*
     * Advances the binary data iteration and ignores the data.
     */
    private static advance(data: Buffer, type: number) {
        if (type === 0) {
            [data] = Parser.varint(data);
        } else if (type === 1) {
            data = data.subarray(8);
        } else if (type === 2) {
            let length: number;

            [data, length] = Parser.varint(data);

            data = data.subarray(length);
        } else if (type === 5) {
            data = data.subarray(4);
        }

        return data;
    }

    /*
     * Converts the binary data into a type and field.
     */
    private static varint(data: Buffer): [Buffer, number] {
        let key = 0;

        const fields: number[] = [];

        for (let index = 0; index < data.length; index++) {
            if (data[index] & 0x80) {
                fields.push(data[index] & 0x7f);
            } else {
                fields.push(data[index] & 0x7f);

                break;
            }
        }

        for (let index = fields.length - 1; index >= 0; index--) {
            key = (key << 7) | fields[index];
        }

        return [data.subarray(fields.length), key];
    }

    /*
     * Deconstructs a binary data field.
     */
    private static deconstruct(data: Buffer): [Buffer, number, number] {
        let key = 0;

        const fields: number[] = [];

        for (let index = 0; index < data.length; index++) {
            if (data[index] & 0x80) {
                fields.push(data[index] & 0x7f);
            } else {
                fields.push(data[index] & 0x7f);

                break;
            }
        }

        for (let index = fields.length - 1; index >= 0; index--) {
            key = (key << 7) | fields[index];
        }

        return [data.subarray(fields.length), key & 0x07, key >>> 3];
    }
}
