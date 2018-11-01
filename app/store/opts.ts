
enum MemoryLimitPolicy {
    // Throw an exception.
    MEMORY_LIMIT_POLICY_THROW = 0,

    // Evict using LRU algorithm
    MEMORY_LIMIT_POLICY_EVICT_LRU = 1,

    // Evict using LFU algorithm.
    MEMORY_LIMIT_POLICY_EVICT_LFU = 2
}

export default class StoreOpts {
    __memoryLimitPolicy : MemoryLimitPolicy = MemoryLimitPolicy.MEMORY_LIMIT_POLICY_THROW;
    __maxSizeBytes: number = 0;

    setMaxSizeBytes(bytes : number) : StoreOpts {
        this.__maxSizeBytes = bytes;

        return this;
    }

    get maxSizeBytes() : number {
        return this.__maxSizeBytes;
    }

    setMemoryLimitPolicy(policy : MemoryLimitPolicy) : StoreOpts {
        this.__memoryLimitPolicy = policy;

        return this;
    }

    get memoryLimitPolicy() : MemoryLimitPolicy {
        return this.__memoryLimitPolicy;
    }
};