export default class StoreStats {
  // The amount of memory, in bytes, the store is occupying.
  // This is not an exact amount, we're using Javascipt afterall.
  private __memorySizeBytes : number = 0;

  get memorySizeBytes() : number {
    return this.__memorySizeBytes;
  }

  set memorySizeBytes(size : number) {
    this.__memorySizeBytes = size;
  }
}
