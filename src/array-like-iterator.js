var kapheinJsTypeTrait = require("kaphein-js-type-trait");
var isNumber = kapheinJsTypeTrait.isNumber;

var isSymbolSupported = require("./is-symbol-supported").isSymbolSupported;

module.exports = (function ()
{
    /**
     *  @template T
     *  @constructor
     *  @param {ArrayLike<T>} arrayLike
     */
    function ArrayLikePairIterator(arrayLike)
    {
        this._arr = arrayLike;
        this._index = 0;
    }

    ArrayLikePairIterator.prototype = {
        constructor : ArrayLikePairIterator,

        /**
         *  @returns {IteratorResult<T>}
         */
        next : function next()
        {
            var done = !isNumber(this._arr.length) || this._index >= this._arr.length;
            var result = {
                value : (done ? void 0 : [this._index, this._arr[this._index]]),
                done : done
            };

            if(!done)
            {
                ++this._index;
            }

            return result;
        }
    };

    /**
     *  @template T
     *  @constructor
     *  @param {ArrayLike<T>} arrayLike
     */
    function ArrayLikeKeyIterator(arrayLike)
    {
        this._arr = arrayLike;
        this._index = 0;
    }

    ArrayLikeKeyIterator.prototype = {
        constructor : ArrayLikeKeyIterator,

        /**
         *  @returns {IteratorResult<T>}
         */
        next : function next()
        {
            var done = !isNumber(this._arr.length) || this._index >= this._arr.length;
            var result = {
                value : (done ? void 0 : this._index),
                done : done
            };

            if(!done)
            {
                ++this._index;
            }

            return result;
        }
    };

    /**
     *  @template T
     *  @constructor
     *  @param {ArrayLike<T>} arrayLike
     */
    function ArrayLikeValueIterator(arrayLike)
    {
        this._arr = arrayLike;
        this._index = 0;
    }

    ArrayLikeValueIterator.prototype = {
        constructor : ArrayLikeValueIterator,

        /**
         *  @returns {IteratorResult<T>}
         */
        next : function next()
        {
            var done = !isNumber(this._arr.length) || this._index >= this._arr.length;
            var result = {
                value : (done ? void 0 : this._arr[this._index]),
                done : done
            };

            if(!done)
            {
                ++this._index;
            }

            return result;
        }
    };

    if(isSymbolSupported())
    {
        var returnThis = function ()
        {
            return this;
        };

        ArrayLikePairIterator.prototype[Symbol.iterator] = returnThis;

        ArrayLikeKeyIterator.prototype[Symbol.iterator] = returnThis;

        ArrayLikeValueIterator.prototype[Symbol.iterator] = returnThis;
    }

    return {
        ArrayLikePairIterator : ArrayLikePairIterator,
        ArrayLikeKeyIterator : ArrayLikeKeyIterator,
        ArrayLikeValueIterator : ArrayLikeValueIterator
    };
})();
