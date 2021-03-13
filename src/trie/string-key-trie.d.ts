import { StringKeyMap } from "../record-wrapper";
import { Trie } from "./trie";

export declare class StringKeyTrie<V> implements Trie<string, V>
{
    public constructor(
        iterable? : Iterable<[string, V]> | null
    );

    public readonly size : number;

    public [Symbol.iterator]() : IterableIterator<[string, V]>;

    public entries() : IterableIterator<[string, V]>;

    public keys() : IterableIterator<string>;

    public values() : IterableIterator<V>;

    public forEach(
        callbackFn : (
            value: V,
            key: string,
            map: Trie<string, V>
        ) => void,
        thisArg?: any
    ) : void;

    public map<R>(
        callbackFn : (
            value: V,
            key: string,
            map: StringKeyTrie<V>
        ) => R,
        thisArg?: any
    ) : R[];

    public has(
        key : string
    ) : boolean;

    public hasPrefix(
        key : string
    ) : boolean;

    public get(
        key : string
    ) : V | undefined;

    public getPrefixMap(
        key : string
    ) : Map<string, V>;

    public set(
        key : string,
        value : V
    ) : this;

    public delete(
        key : string
    ) : boolean;

    public del(
        key : string
    ) : boolean;

    public clear() : void;

    public [Symbol.toStringTag] : string;

    public toJSON() : [string, V][];
}
