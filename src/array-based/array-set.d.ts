import { EqualComparer } from "../equal-comparer";

export declare class ArraySet<T> implements Set<T>
{
    public static wrap<T>(
        src : T[],
        comparer? : EqualComparer<T>
    ) : ArraySet<T>;

    public constructor(
        iterable? : Iterable<T>,
        comparer? : EqualComparer<T>
    );

    public attach(
        arr : T[]
    ) : void;

    public detach() : T[];

    public readonly size : number;

    public getElementCount() : number;

    public getAt(
        index : number
    ) : T;

    public setAt(
        index : number,
        value : T
    ) : void;

    public forEach(
        callbackfn : (
            value : T,
            value2 : T,
            set : Set<T>
        ) => void,
        thisArg? : any
    ): void;

    public [Symbol.iterator]() : IterableIterator<T>;

    public entries() : IterableIterator<[T, T]>;

    public keys() : IterableIterator<T>;

    public values() : IterableIterator<T>;

    public has(
        value : T
    ): boolean;

    public findIndex(
        predicate : (
            value : T,
            index : number
        ) => boolean,
        thisArg : any
    ) : number

    public indexOf(
        value : T,
        equalComparer? : EqualComparer<T>
    ) : number;

    public add(
        value : T
    ) : this;

    public addOrReplace(
        value : T
    ) : this;

    public tryAdd(
        value : T
    ) : boolean;

    public insertOrReplace(
        index : number,
        value : T
    ) : this;

    public removeAt(
        index : number
    ) : boolean;

    public delete(
        value : T
    ) : boolean;

    public del(
        value : T
    ) : boolean;

    public clear() : void;

    public [Symbol.toStringTag] : string;

    public toString() : string;

    public toJSON() : T[];

    public toArray() : T[];
}
