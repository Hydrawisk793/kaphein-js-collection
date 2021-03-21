/**
 * A ECMAScript 6 map implementaion using plain ECMAScript object.
 * The type of key is limited to strings.
 */
export declare class StringKeyMap<V> implements Map<string, V>
{
    public static wrap<T>(
        src : Record<string, T>
    ) : StringKeyMap<T>;

    /**
     * Creates a new map and inserts key-value pairs from the specified array.
     *  @param iterable An array of key-value pairs.
     * Each pair is an array whose the first element is key and the second element is value.
     */
    public constructor(
        iterable? : Iterable<[string, V]>
    );

    public attach(
        obj : Record<string, V>
    ) : void;

    public detach() : Record<string, V>;

    /**
     * Gets the number of key-value pair in the map.
     */
    public readonly size : number;

    public getSize() : number;

    /**
     * Removes all elements in the map.
     */
    public clear() : void;

    public delete(
        key : string
    ) : boolean;

    public forEach(
        callbackFn : (
            value : V,
            key : string,
            map : Map<string, V>
        ) => void,
        thisArg? : any
    ) : void;

    public map<R>(
        callbackFn : (
            value : V,
            key : string,
            map : StringKeyMap<V>
        ) => R,
        thisArg? : any
    ) : R[];

    public [Symbol.iterator]() : IterableIterator<[string, V]>;

    public entries() : IterableIterator<[string, V]>;

    public keys() : IterableIterator<string>;

    public values() : IterableIterator<V>;

    public get(
        key : string
    ) : V | undefined;

    public has(
        key : string
    ) : boolean;

    public set(
        key : string,
        value : V
    ) : this;

    public [Symbol.toStringTag] : string;

    public toJSON() : [string, V][];

    /**
     *  @deprecated Use toRecord method instead.
     */
    public toPlainObject() : Record<string, V>;

    public toRecord() : Record<string, V>;
}
