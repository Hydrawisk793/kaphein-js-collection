import { IterableQueue } from "./queue";

export declare class ListQueue<T> implements IterableQueue<T>
{
    public constructor(
        iterable? : Iterable<T>
    );

    public readonly size : number;

    public isEmpty() : boolean;

    public isFull() : boolean;

    public peek() : T | undefined;

    public enqueue(
        element : T
    ) : void;

    public dequeue() : T | undefined;

    public clear() : void;

    public forEach(
        callback : (
            element : T,
            index : number,
            queue : ListQueue<T>
        ) => void,
        thisArg? : any
    ) : void;

    public [Symbol.iterator]() : IterableIterator<T>;

    public entries() : IterableIterator<[number, T]>;

    public keys() : IterableIterator<number>;

    public values() : IterableIterator<T>;

    public [Symbol.toStringTag] : string;

    public toString() : string;
}
