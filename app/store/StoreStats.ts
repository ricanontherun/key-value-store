export default class StoreStats {
    private __memorySizeBytes : number = 0;

    get memorySizeBytes() : number {
        return this.__memorySizeBytes;
    }

    set memorySizeBytes(size : number) {
        this.__memorySizeBytes = size;
    }
}