export declare class NumberSet implements Set<number>
{
    public constructor(
        iterable? : Iterable<number>
    );

    public readonly size : number;

    public forEach(
        callbackfn : (
            value : number,
            value2 : number,
            set : Set<number>
        ) => void,
        thisArg? : any
    ) : void;

    public [Symbol.iterator](): IterableIterator<number>;

    public entries() : IterableIterator<[number, number]>;

    public keys() : IterableIterator<number>;

    public values() : IterableIterator<number>;

    public has(
        value : number
    ) : boolean;

    public add(
        value : number
    ) : this;

    public delete(
        value : number
    ) : boolean;

    public clear() : void;

    public [Symbol.toStringTag] : string;

    public toJSON() : number[];
}
