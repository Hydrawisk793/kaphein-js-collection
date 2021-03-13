export declare class ArrayLikePairIterator<T> implements IterableIterator<[number, T]>
{
    public constructor(
        arrayLike : ArrayLike<T>
    );

    public next() : IteratorResult<[number, T]>;

    public [Symbol.iterator]() : IterableIterator<[number, T]>;
}

export declare class ArrayLikeKeyIterator implements IterableIterator<number>
{
    public constructor(
        arrayLike : ArrayLike<number>
    );

    public next() : IteratorResult<number>;

    public [Symbol.iterator]() : IterableIterator<number>;
}

export declare class ArrayLikeValueIterator<T> implements IterableIterator<T>
{
    public constructor(
        arrayLike : ArrayLike<T>
    );

    public next() : IteratorResult<T>;

    public [Symbol.iterator]() : IterableIterator<T>;
}
