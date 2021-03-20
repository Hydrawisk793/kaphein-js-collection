var kapheinJsTypeTrait = require("kaphein-js-type-trait");
var isDefinedAndNotNull = kapheinJsTypeTrait.isDefinedAndNotNull;
var isArray = kapheinJsTypeTrait.isArray;
var isFunction = kapheinJsTypeTrait.isFunction;

var isSymbolSupported = require("./is-symbol-supported").isSymbolSupported;

module.exports = (function ()
{
    var _isSymbolSupported = isSymbolSupported();

    /**
     *  @template T
     *  @param {Iterable<T>} iterable
     *  @param {(
            value : T,
            iterable : Iterable<T>,
        ) => boolean} callback
     *  @param {any} [thisArg]
     *  @param {string | number | symbol} [getIteratorFunctionKey]
     */
    function forOf(iterable, callback)
    {
        var thisArg = arguments[2];
        var shouldContinue = true;
        var i;

        if(isArray(iterable))
        {
            for(i = 0; shouldContinue && i < iterable.length; ++i)
            {
                shouldContinue = !callback.call(thisArg, iterable[i], iterable);
            }
        }
        else
        {
            var getIteratorFunctionKey = arguments[3];
            if(!isDefinedAndNotNull(getIteratorFunctionKey))
            {
                if(_isSymbolSupported)
                {
                    getIteratorFunctionKey = Symbol.iterator;
                }
                else
                {
                    throw new Error("The forth arugment must be specified because the environment does not support native ECMAScript 6 Symbol.");
                }
            }

            if(
                !(getIteratorFunctionKey in iterable)
                || !isFunction(iterable[getIteratorFunctionKey])
            )
            {
                throw new TypeError("'iterable' must be an iterable object.");
            }

            var iR;
            for(
                i = iterable[getIteratorFunctionKey](), iR = i.next();
                shouldContinue && !iR.done;
                iR = i.next()
            )
            {
                shouldContinue = !callback.call(thisArg, iR.value, iterable);
            }
        }

        return shouldContinue;
    }

    return {
        forOf : forOf
    };
})();
