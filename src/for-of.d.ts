export declare function forOf<T>(
    iterable : Iterable<T>,
    callback : (
        value : T,
        iterable : Iterable<T>,
    ) => boolean,
    thisArg? : any,
    getIteratorFunctionKey? : string | number | symbol
) : boolean;
