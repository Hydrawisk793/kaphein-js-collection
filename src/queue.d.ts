export declare interface Queue<T>
{
    readonly size : number;

    isEmpty() : boolean;

    peek() : T | undefined;

    enqueue(
        element : T
    ) : void;

    dequeue() : T | undefined;

    flush() : T[];

    clear() : void;
}

export declare interface IterableQueue<T> extends Queue<T>, Iterable<T>
{
    [Symbol.iterator]() : Iterator<T>;

    entries() : IterableIterator<[number, T]>;

    keys() : IterableIterator<number>;

    values() : IterableIterator<T>;
}
