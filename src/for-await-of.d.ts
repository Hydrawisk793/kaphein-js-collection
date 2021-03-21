import { MayBePromise } from "kaphein-ts-type-utils";

/**
 *  Iterates over an `AsyncIterable<T>` object.  
 *  Unlike the native `for await...of` statement, this function tries to iterate all kind of objects that satisfy `ArrayLike<T>` or `Iterable<T>`.
 *  @param asyncIterable An object that satisfies `AsyncIterable<T>`, `ArrayLike<T>` or `Iterable<T>`.
 *  @param callback A callback function to execute on each element of `asyncIterable`.
 *  @param thisArg An optional parameter to use as `this` when executing `callback`.
 *  @param getAsyncIteratorFunctionKey If specified, the function uses the parameter as a key to find a function that returns `AsyncIterator<T>` object.  
 *  If `Symbol.asyncIterator` is not supported and `asyncIterable` does not satisfy `ArrayLike<T>` and `Iterable<T>`, this parameter is mandatory.
 */
export declare function forAwaitOf<
    T
>(
    asyncIterable : AsyncIterable<T> | ArrayLike<T> | Iterable<T>,
    callback : (
        value : T,
        asyncIterable : AsyncIterable<T> | ArrayLike<T> | Iterable<T>,
    ) => MayBePromise<boolean>,
    thisArg? : any,
    getAsyncIteratorFunctionKey? : string | number | symbol
) : Promise<boolean>;
