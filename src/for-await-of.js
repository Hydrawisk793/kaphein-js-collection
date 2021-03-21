var kapheinJsTypeTrait = require("kaphein-js-type-trait");
var isDefinedAndNotNull = kapheinJsTypeTrait.isDefinedAndNotNull;
var isArrayLike = kapheinJsTypeTrait.isArrayLike;
var isFunction = kapheinJsTypeTrait.isFunction;
var isIterable = kapheinJsTypeTrait.isIterable;

module.exports = (function ()
{
    /**
     *  @template T
     *  @typedef {import("kaphein-ts-type-utils").MayBePromise<T>} MayBePromise
     */

    /**
     *  @template T
     *  @param {AsyncIterable<T>} asyncIterable
     *  @param {(
            value : T,
            asyncIterable : AsyncIterable<T>,
        ) => MayBePromise<boolean>} callback
     *  @param {any} [thisArg]
     *  @param {string | number | symbol} [getAsyncIteratorFunctionKey]
     */
    function forAwaitOf(asyncIterable, callback)
    {
        if("function" !== typeof Promise)
        {
            throw new Error("The environment does not support ECMAScript 6 Promise.");
        }

        var thisArg = arguments[2];
        var getAsyncIteratorFunctionKey = arguments[3];

        return /** @type {Promise<boolean>} */(new Promise(function (resolve)
        {
            var isSymbolAsyncIteratorSupported = "function" === typeof Symbol
                && "asyncIterator" in Symbol
            ;

            if(!isDefinedAndNotNull(getAsyncIteratorFunctionKey))
            {
                if(isSymbolAsyncIteratorSupported)
                {
                    getAsyncIteratorFunctionKey = Symbol.asyncIterator;
                }
            }
            var keyExists = isDefinedAndNotNull(getAsyncIteratorFunctionKey);

            if(
                keyExists
                && (getAsyncIteratorFunctionKey in asyncIterable)
                && isFunction(asyncIterable[getAsyncIteratorFunctionKey])
            )
            {
                resolve(_asyncIterateAsyncIterable(asyncIterable, callback, thisArg, getAsyncIteratorFunctionKey));
            }
            else if(isArrayLike(asyncIterable))
            {
                resolve(_asyncIterateArrayLike(asyncIterable, callback, thisArg));
            }
            else if(isIterable(asyncIterable))
            {
                resolve(_asyncIterateIterable(asyncIterable, callback, thisArg));
            }
            else
            {
                if(keyExists)
                {
                    throw new TypeError("'asyncIterable' must be an async iterable object.");
                }
                else
                {
                    throw new Error("The forth arugment must be specified because the environment does not support 'Symbol.asyncIterator'.");
                }
            }
        }));
    }

    /**
     *  @template T
     *  @param {ArrayLike<T>} arrayLike
     *  @param {(
            value : T,
            asyncIterable : AsyncIterable<T>,
        ) => MayBePromise<boolean>} callback
        *  @param {any} thisArg
        */
    function _asyncIterateArrayLike(arrayLike, callback, thisArg)
    {
        var ctx = {
            i : 0
        };

        /**
         *  @param {Promise<boolean>} promise
         *  @returns {Promise<boolean>}
         */
        function _iterateArrayLike(promise)
        {
            return promise
                .then(function (shouldStop)
                {
                    var result;

                    if(shouldStop)
                    {
                        result = !!shouldStop;
                    }
                    else
                    {
                        if(ctx.i >= arrayLike.length)
                        {
                            result = !!shouldStop;
                        }
                        else
                        {
                            result = _iterateArrayLike(/** @type {Promise<boolean>} */(new Promise(function (resolve)
                            {
                                var value = arrayLike[ctx.i];
                                ++ctx.i;

                                resolve(callback.call(thisArg, value, arrayLike));
                            })));
                        }
                    }

                    return result;
                })
            ;
        }

        return _iterateArrayLike((new Promise(function (resolve)
        {
            resolve(false);
        })));
    }

    /**
     *  @template T
     *  @param {Iterable<T>} iterable
     *  @param {(
            value : T,
            asyncIterable : AsyncIterable<T>,
        ) => MayBePromise<boolean>} callback
        *  @param {any} thisArg
        */
    function _asyncIterateIterable(iterable, callback, thisArg)
    {
        var ctx = {
            /** @type {Iterator<T, T>} */i : null
        };

        /**
         *  @param {Promise<boolean>} promise
         *  @returns {Promise<boolean>}
         */
        function _iterateIterable(promise)
        {
            return promise
                .then(function (shouldStop)
                {
                    var result;

                    if(shouldStop)
                    {
                        result = !!shouldStop;
                    }
                    else
                    {
                        var iR = ctx.i.next();
                        if(iR.done)
                        {
                            result = !!shouldStop;
                        }
                        else
                        {
                            result = _iterateIterable(/** @type {Promise<boolean>} */(new Promise(function (resolve)
                            {
                                resolve(callback.call(thisArg, iR.value, iterable));
                            })));
                        }
                    }

                    return result;
                })
            ;
        }

        return _iterateIterable((new Promise(function (resolve)
        {
            ctx.i = iterable[Symbol.iterator]();

            resolve(false);
        })));
    }

    /**
     *  @template T
     *  @param {AsyncIterable<T>} asyncIterable
     *  @param {(
            value : T,
            asyncIterable : AsyncIterable<T>,
        ) => MayBePromise<boolean>} callback
        *  @param {any} thisArg
        */
    function _asyncIterateAsyncIterable(asyncIterable, callback, thisArg, getAsyncIteratorFunctionKey)
    {
        var ctx = {
            /** @type {AsyncIterator<T, T>} */i : null
        };

        /**
         *  @param {Promise<boolean>} promise
         *  @returns {Promise<boolean>}
         */
        function _iterateAsyncIterable(promise)
        {
            return promise
                .then(function (shouldStop)
                {
                    var result;

                    if(shouldStop)
                    {
                        result = !!shouldStop;
                    }
                    else
                    {
                        result = /** @type {ReturnType<(typeof ctx)["i"]["next"]>} */(new Promise(function (resolve)
                        {
                            resolve(ctx.i.next());
                        }))
                            .then(function (iR)
                            {
                                var result;

                                if(iR.done)
                                {
                                    result = !!shouldStop;
                                }
                                else
                                {
                                    result = _iterateAsyncIterable(/** @type {Promise<boolean>} */(new Promise(function (resolve)
                                    {
                                        resolve(callback.call(thisArg, iR.value, asyncIterable));
                                    })));
                                }

                                return result;
                            })
                        ;
                    }

                    return result;
                })
            ;
        }

        return _iterateAsyncIterable((new Promise(function (resolve)
        {
            ctx.i = asyncIterable[getAsyncIteratorFunctionKey]();

            resolve(false);
        })));
    }

    return {
        forAwaitOf : forAwaitOf
    };
})();
