import { EqualComparer } from "../equal-comparer";

export declare class ArrayMap<K, V> implements Map<K, V>
{
    public static wrap<K, V>(
        src : [K, V][],
        keyEqualComparer? : EqualComparer<K>
    ) : ArrayMap<K, V>;

    public constructor(
        iterable? : Iterable<[K, V]>,
        keyEqualComparer? : EqualComparer<K>
    );

    public attach(
        arr : [K, V][]
    ) : void;

    public detach() : [K, V][];

    public readonly size : number;

    public getElementCount() : number;

    public forEach(
        callbackfn : (
            value : V,
            key : K,
            map : Map<K, V>
        ) => void,
        thisArg? : any
    ) : void;

    public [Symbol.iterator]() : IterableIterator<[K, V]>;

    public entries() : IterableIterator<[K, V]>;

    public keys() : IterableIterator<K>;

    public values() : IterableIterator<V>;

    public has(
        key : K
    ) : boolean;

    public findIndex(
        callback : (
            value : [K, V],
            index : number 
        ) => boolean,
        thisArg? : any
    ) : number;

    public indexOf(
        key : K
    ) : number;

    public get(
        key : K
    ) : V;

    public get(
        key : K,
        defaultValue : V
    ) : V;

    public getAt(
        index : number
    ) : [K, V];

    public set(
        key : K,
        value : V
    ) : this;

    public delete(
        key : K
    ) : boolean;

    public del(
        key : K
    ) : boolean;

    public clear() : void;

    public [Symbol.toStringTag] : string;

    public toJSON() : [K, V][];

    public toArray() : [K, V][];
}
