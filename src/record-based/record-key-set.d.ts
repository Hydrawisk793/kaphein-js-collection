export declare class RecordKeySet
    implements Set<(string | number | symbol)>
{
    public constructor(
        iterable? : Iterable<(string | number | symbol)>
    );

    public readonly size : number;

    public forEach(
        callbackfn : (
            value : (string | number | symbol),
            value2 : (string | number | symbol),
            set : Set<(string | number | symbol)>
        ) => void,
        thisArg? : any
    ) : void;

    public [Symbol.iterator](): IterableIterator<(string | number | symbol)>;

    public entries() : IterableIterator<[(string | number | symbol), (string | number | symbol)]>;

    public keys() : IterableIterator<(string | number | symbol)>;

    public values() : IterableIterator<(string | number | symbol)>;

    public has(
        value : (string | number | symbol)
    ) : boolean;

    public add(
        value : (string | number | symbol)
    ) : this;

    public delete(
        value : (string | number | symbol)
    ) : boolean;

    public clear() : void;

    public [Symbol.toStringTag] : string;

    public toJSON() : (string | number | symbol)[];
}
