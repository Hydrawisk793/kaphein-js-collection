var kapheinJsTypeTrait = require("kaphein-js-type-trait");
var isUndefined = kapheinJsTypeTrait.isUndefined;
var isArray = kapheinJsTypeTrait.isArray;
var isIterable = kapheinJsTypeTrait.isIterable;
var isFunction = kapheinJsTypeTrait.isFunction;

var isSymbolSupported = require("../is-symbol-supported").isSymbolSupported;
var _mapToJSON = require("../to-json-impl")._mapToJSON;
var _defaultEqualComparer = require("../comparer-impl")._defaultEqualComparer;
var ArrayLikeValueIterator = require("../array-like-iterator").ArrayLikeValueIterator;

module.exports = (function ()
{
    /**
     *  @template K
     *  @typedef {import("./equal-comparer").EqualComparer<K>} EqualComparer
     */

    /**
     *  @template K, V
     *  @constructor
     *  @param {Iterable<[K, V]>} [iterable]
     *  @param {EqualComparer<K>} [keyEqualComparer]
     */
    function ArrayMap()
    {
        var iterable = arguments[0];
        var keyEqualComparer = arguments[1];

        this._keyEqualComparer = (isFunction(keyEqualComparer) ? keyEqualComparer : _defaultEqualComparer);
        /**  @type {[K, V][]} */this._pairs = null;
        this.clear();

        if(isIterable(iterable))
        {
            _addRange(this, iterable);

            this.size = this.getElementCount();
        }
    }

    /**
     *  @template K, V
     *  @param {[K, V][]} src
     *  @param {EqualComparer<K>} [keyEqualComparer]
     */
    ArrayMap.wrap = function wrap(src)
    {
        /** @type {ArrayMap<K, V>} */var map = new ArrayMap(null, arguments[1]);
        map.attach(src);

        return map;
    };

    ArrayMap.prototype = {
        constructor : ArrayMap,

        /**
         *  @param {[K, V][]} arr
         */
        attach : function attach(arr)
        {
            if(!isArray(arr))
            {
                throw new TypeError("'arr' must be an array.");
            }

            this._elements = arr;
            this.size = arr.length;
        },

        detach : function detach()
        {
            var arr = this._elements;

            this.clear();

            return arr;
        },

        size : 0,

        /**
         *  @returns {number}
         */
        getElementCount : function getElementCount()
        {
            return this._pairs.length;
        },

        /**
         *  @param {Function} callback
         */
        forEach : function forEach(callback)
        {
            var thisArg = arguments[1];

            for(var count = this._pairs.length, i = 0; i < count; ++i)
            {
                var pair = this._pairs[i];
                callback.call(thisArg, pair[1], pair[0], this);
            }
        },

        entries : function entries()
        {
            return new ArrayLikeValueIterator(this._pairs);
        },

        keys : function keys()
        {
            return new PairArrayIterator(this._pairs, 0);
        },

        values : function values()
        {
            return new PairArrayIterator(this._pairs, 1);
        },

        /**
         *  @param {K} key
         *  @returns {boolean}
         */
        has : function has(key)
        {
            return this.indexOf(key) >= 0;
        },

        /**
         *  @param {Function} callback
         *  @param {*} [thisArg]
         */
        findIndex : function findIndex(callback)
        {
            return this._pairs.findIndex(callback, arguments[1]);
        },

        /**
         *  @param {K} key
         */
        indexOf : function indexOf(key)
        {
            for(var count = this._pairs.length, index = -1, i = 0; index < 0 && i < count; ++i)
            {
                if(this._keyEqualComparer(this._pairs[i][0], key))
                {
                    index = i;
                }
            }

            return index;
        },

        /**
         *  @param {K} key
         *  @param {V} [defaultValue]
         *  @returns {V}
         */
        get : function get(key)
        {
            var index = this.indexOf(key);

            return (
                index >= 0
                    ? this._pairs[index][1]
                    : arguments[1]
            );
        },

        /**
         *  @param {number} index
         *  @returns {[K, V]}
         */
        getAt : function getAt(index)
        {
            if(!Number.isSafeInteger(index) || index < 0)
            {
                throw new TypeError("'index' must be a non-negative safe integer.");
            }
            else if(index >= this._pairs.length)
            {
                throw new RangeError("'index' must be in range [0, " + this._pairs.length + ").");
            }

            return this._pairs[index].slice();
        },

        /**
         *  @param {K} key
         *  @param {V} value
         */
        set : function set(key, value)
        {
            var index = this.indexOf(key);

            if(index >= 0)
            {
                this._pairs[index][1] = value;
            }
            else
            {
                this._pairs.push([key, value]);

                ++this.size;
            }

            return this;
        },

        /**
         *  @param {K} key
         *  @returns {boolean}
         */
        "delete" : function (key)
        {
            return this.del(key);
        },

        /**
         *  @param {K} key
         *  @returns {boolean}
         */
        del : function del(key)
        {
            var index = this.indexOf(key);
            var result = index >= 0;
            if(result)
            {
                this._pairs.splice(index, 1);

                --this.size;
            }

            return result;
        },

        clear : function clear()
        {
            this._pairs = [];
            this.size = 0;
        },

        toJSON : function toJSON()
        {
            return _mapToJSON(this);
        },

        toArray : function toArray()
        {
            return this._pairs.slice();
        }
    };

    /**
     *  @template K, V
     *  @param {[K, V][]} pairs
     *  @param {number} pairIndex
     *  @param {number} [index = 0]
     */
    function PairArrayIterator(pairs, pairIndex)
    {
        this._pairs = pairs;
        this._pairIndex = pairIndex
        this._index = isUndefined(arguments[2]) ? 0 : arguments[2];
    }

    /**
     *  @returns {IteratorReturnResult<K> | IteratorReturnResult<V>}
     */
    PairArrayIterator.prototype.next = function ()
    {
        var out = {
            done : this._index >= this._pairs.length,
            value : void 0
        };

        if(!out.done)
        {
            out.value = this._pairs[this._index][this._pairIndex];
            ++this._index;
        }

        return out;
    };

    if(isSymbolSupported())
    {
        ArrayMap.prototype[Symbol.iterator] = ArrayMap.prototype.entries;

        ArrayMap.prototype[Symbol.toStringTag] = "ArrayMap";

        var returnThis = function ()
        {
            return this;
        };

        PairArrayIterator.prototype[Symbol.iterator] = returnThis;
    }

    /**
     *  @template K, V
     *  @param {Map<K, V>} mapObj
     *  @param {Iterable<[K, V]>} iterable
     */
    function _addRange(mapObj, iterable)
    {
        if(!isIterable(iterable))
        {
            throw new TypeError("Parameter 'iterable' must have a property 'Symbol.iterator'.");
        }

        for(
            var i = iterable[Symbol.iterator](), iP = i.next();
            !iP.done;
            iP = i.next()
        )
        {
            mapObj.set(iP.value[0], iP.value[1]);
        }

        return mapObj;
    }

    return {
        ArrayMap : ArrayMap
    };
})();
