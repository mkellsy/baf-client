export abstract class Device {
    public static generateId(id: string, suffix: string): string {
        return `BAF-${id}-${suffix.toUpperCase()}`
    }
}
