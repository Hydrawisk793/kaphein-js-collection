export declare class StringSet implements Set<string>
{
    public constructor(
        iterable? : Iterable<string>
    );

    public readonly size : number;

    public forEach(
        callbackfn : (
            value : string,
            value2 : string,
            set : Set<string>
        ) => void,
        thisArg? : any
    ) : void;

    public [Symbol.iterator](): IterableIterator<string>;

    public entries() : IterableIterator<[string, string]>;

    public keys() : IterableIterator<string>;

    public values() : IterableIterator<string>;

    public has(
        value : string
    ) : boolean;

    public add(
        value : string
    ) : this;

    public delete(
        value : string
    ) : boolean;

    public clear() : void;

    public [Symbol.toStringTag] : string;

    public toJSON() : string[];
}
