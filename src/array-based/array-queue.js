var kapheinJsTypeTrait = require("kaphein-js-type-trait");
var isIterable = kapheinJsTypeTrait.isIterable;

var forOf = require("../for-of").forOf;
var isSymbolSupported = require("../is-symbol-supported").isSymbolSupported;
var arrayLikeIterator = require("../array-like-iterator");
var ArrayLikePairIterator = arrayLikeIterator.ArrayLikePairIterator;
var ArrayLikeKeyIterator = arrayLikeIterator.ArrayLikeKeyIterator;
var ArrayLikeValueIterator = arrayLikeIterator.ArrayLikeValueIterator;

module.exports = (function ()
{
    /**
     *  @template T
     *  @constructor
     */
    function ArrayQueue()
    {
        /** @type {T[]} */this._elements = null;
        this.size = 0;

        this.clear();

        /** @type {Iterable<T>} */var iterable = arguments[0];
        if(isIterable(iterable))
        {
            forOf(
                iterable,
                /**
                 *  @this {ArrayQueue<T>}
                 */
                function (value)
                {
                    this.enqueue(value);
                },
                this
            );
        }
    }

    ArrayQueue.prototype = {
        constructor : ArrayQueue,

        size : 0,

        isEmpty : function isEmpty()
        {
            return this.size < 1;
        },

        peek : function peek()
        {
            return (this.isEmpty() ? void 0 : this._elements[0]);
        },

        /**
         *  @param {T} v
         */
        enqueue : function enqueue(v)
        {
            this._elements.push(v);
            ++this.size;
        },

        /**
         *  @returns {T | undefined}
         */
        dequeue : function dequeue()
        {
            var elem = void 0;

            if(!this.isEmpty())
            {
                elem = this._elements.shift();
                --this.size;
            }

            return elem;
        },

        flush : function flush()
        {
            var elems = this._elements;

            this.clear();

            return elems;
        },

        clear : function clear()
        {
            this._elements = [];
            this.size = 0;
        },

        forEach : function forEach(callback)
        {
            var thisArg = arguments[1];

            for(var i = 0; i < this._elements.length; ++i)
            {
                callback.call(thisArg, this._elements[i], i, this);
            }
        },

        entries : function entries()
        {
            return new ArrayLikePairIterator(this._elements);
        },

        keys : function keys()
        {
            return new ArrayLikeKeyIterator(this._elements);
        },

        values : function values()
        {
            return new ArrayLikeValueIterator(this._elements);
        },

        get : function get(index)
        {
            if(!Number.isSafeInteger(index))
            {
                throw new TypeError("'index' must be a safe integer.");
            }
            if(index < 0 || index >= this._elements.length)
            {
                throw new RangeError("'index' is out of range.");
            }

            return this._elements[index];
        },

        set : function set(index, element)
        {
            if(!Number.isSafeInteger(index))
            {
                throw new TypeError("'index' must be a safe integer.");
            }
            if(index < 0 || index >= this._elements.length)
            {
                throw new RangeError("'index' is out of range.");
            }

            this._elements[index] = element;
        }
    };

    if(isSymbolSupported())
    {
        ArrayQueue.prototype[Symbol.iterator] = ArrayQueue.prototype.values;

        ArrayQueue.prototype[Symbol.toStringTag] = "ArrayQueue";
    }

    return {
        ArrayQueue : ArrayQueue
    };
})();
