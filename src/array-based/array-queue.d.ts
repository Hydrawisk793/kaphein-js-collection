import { IterableQueue } from "../queue";

export declare class ArrayQueue<T> implements IterableQueue<T>
{
    public static wrap<T>(
        src : T[]
    ) : ArrayQueue<T>;

    public constructor(
        iterable? : Iterable<T>
    );

    public attach(
        src : T[]
    ) : void;

    public detach() : T[];

    public readonly size : number;

    public isEmpty() : boolean;

    public peek() : T | undefined;

    public enqueue(
        element : T
    ) : void;

    public dequeue() : T | undefined;
    
    public flush() : T[];

    public clear() : void;

    public forEach(
        callback : (
            element : T,
            index : number,
            queue : ArrayQueue<T>
        ) => void,
        thisArg? : any
    ) : void;

    public [Symbol.iterator]() : Iterator<T>;

    public entries() : IterableIterator<[number, T]>;

    public keys() : IterableIterator<number>;

    public values() : IterableIterator<T>;

    public get(
        index : number
    ) : T;

    public set(
        index : number,
        element : T
    ) : void;

    public [Symbol.toStringTag] : string;
}
