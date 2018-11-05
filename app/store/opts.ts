
export enum MemoryLimitPolicyEnum {
    // Throw an exception.
    MEMORY_LIMIT_POLICY_ERROR = 0,

    // Evict using LRU algorithm
    MEMORY_LIMIT_POLICY_EVICT_LRU = 1,

    // Evict using LFU algorithm.
    MEMORY_LIMIT_POLICY_EVICT_LFU = 2
}

export class Opts {
    private __memoryLimitPolicy : MemoryLimitPolicyEnum = MemoryLimitPolicyEnum.MEMORY_LIMIT_POLICY_ERROR;
    private __maxMemorySize: number = 0;

    setMaxSize(bytes : number) : Opts {
        this.__maxMemorySize = bytes;

        return this;
    }

    get maxSize() : number {
        return this.__maxMemorySize;
    }

    setMemoryLimitPolicy(policy : MemoryLimitPolicyEnum) : Opts {
        this.__memoryLimitPolicy = policy;

        return this;
    }

    get memoryLimitPolicy() : MemoryLimitPolicyEnum {
        return this.__memoryLimitPolicy;
    }
};