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
        var getIteratorFunctionKey = (_isSymbolSupported ? Symbol.iterator : arguments[3]);
        if(!(getIteratorFunctionKey in iterable))
        {
            throw new TypeError("'iterable' must be an iterable object.");
        }

        var thisArg = arguments[2];
        for(
            var shouldMoveNext = true, i = iterable[getIteratorFunctionKey](), iR = i.next();
            shouldMoveNext && !iR.done;
            iR = i.next()
        )
        {
            shouldMoveNext = !callback.call(thisArg, iR.value, iterable);
        }

        return shouldMoveNext;
    }

    return {
        forOf : forOf
    };
})();
