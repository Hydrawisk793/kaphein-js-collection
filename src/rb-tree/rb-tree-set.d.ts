import { Comparer } from "../comparer";
import { RbTreeSearchTarget } from "./rb-tree-search-target";

export declare namespace RbTreeSet
{
    /**
     *  @deprecated import 'RbTreeSearchTarget' enum separately.
     */
    export type SearchTarget = RbTreeSearchTarget;

    export class CppValueIterator<T>
    {
        public equals(
            other : any
        ) : boolean;

        public isNull() : boolean;

        public dereference() : T;

        public moveToNext() : boolean;

        public moveToPrevious() : boolean;
    }
}

export declare class RbTreeSet<T> implements Set<T>
{
    public constructor(
        iterable? : Iterable<T> | null,
        comparer? : Comparer<T>
    );

    public readonly size : number;

    public getElementCount() : number;

    public isEmpty() : boolean;

    public forEach(
        callbackfn : (
            value : T,
            value2 : T,
            set : Set<T>
        ) => void,
        thisArg? : any
    ) : void;

    public begin() : RbTreeSet.CppValueIterator<T>;

    public end() : RbTreeSet.CppValueIterator<T>;

    public [Symbol.iterator]() : IterableIterator<T>;

    public entries() : IterableIterator<[T, T]>;

    public keys() : IterableIterator<T>;

    public values() : IterableIterator<T>;

    public findValue(
        value : T,
        searchTarget : RbTreeSearchTarget
    ) : T | undefined;

    /**
     *  @deprecated Use 'findEntry' method with 'RbTreeSearchTarget' enum instead.
     */
    public find(
        value : T,
        searchTarget : RbTreeSearchTarget
    ) : RbTreeSet.CppValueIterator<T>;

    public has(
        value : T
    ) : boolean;

    public getFirst() : T | undefined;

    public getLast() : T | undefined;

    public add(
        value : T
    ) : this;

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
}
