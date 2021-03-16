var kapheinJsTypeTrait = require("kaphein-js-type-trait");
var isArray = kapheinJsTypeTrait.isArray;

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
            var getIteratorFunctionKey = (_isSymbolSupported ? Symbol.iterator : arguments[3]);
            if(!(getIteratorFunctionKey in iterable))
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
