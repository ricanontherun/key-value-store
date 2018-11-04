
export enum MemoryLimitPolicy {
    // Throw an exception.
    MEMORY_LIMIT_POLICY_ERROR = 0,

    // Evict using LRU algorithm
    MEMORY_LIMIT_POLICY_EVICT_LRU = 1,

    // Evict using LFU algorithm.
    MEMORY_LIMIT_POLICY_EVICT_LFU = 2
}

export default class StoreOpts {
    private __memoryLimitPolicy : MemoryLimitPolicy = MemoryLimitPolicy.MEMORY_LIMIT_POLICY_ERROR;
    private __maxMemorySize: number = 0;

    setMaxSize(bytes : number) : StoreOpts {
        this.__maxMemorySize = bytes;

        return this;
    }

    get maxSize() : number {
        return this.__maxMemorySize;
    }

    setMemoryLimitPolicy(policy : MemoryLimitPolicy) : StoreOpts {
        this.__memoryLimitPolicy = policy;

        return this;
    }

    get memoryLimitPolicy() : MemoryLimitPolicy {
        return this.__memoryLimitPolicy;
    }
};