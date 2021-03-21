export declare function append<T>(
    setObj : Set<T>,
    other : Iterable<T>
) : Set<T>;

export declare function exclude<T>(
    setObj : Set<T>,
    other : Iterable<T>
) : Set<T>;

export declare function difference<T>(
    setObj : Set<T>,
    other : Set<T>
) : T[];

export declare function intersection<T>(
    setObj : Set<T>,
    other : Set<T>
) : T[];
