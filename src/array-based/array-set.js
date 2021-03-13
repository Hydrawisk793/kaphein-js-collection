var kapheinJsTypeTrait = require("kaphein-js-type-trait");
var isArray = kapheinJsTypeTrait.isArray;
var isIterable = kapheinJsTypeTrait.isIterable;
var isFunction = kapheinJsTypeTrait.isFunction;

var isSymbolSupported = require("../is-symbol-supported").isSymbolSupported;
var setAppend = require("../set-extensions").append;
var _defaultEqualComparer = require("../comparer-impl")._defaultEqualComparer;
var _setToJSON = require("../to-json-impl")._setToJSON;
var arrayLikeIterator = require("../array-like-iterator");
var ArrayLikePairIterator = arrayLikeIterator.ArrayLikePairIterator;
var ArrayLikeKeyIterator = arrayLikeIterator.ArrayLikeKeyIterator;
var ArrayLikeValueIterator = arrayLikeIterator.ArrayLikeValueIterator;

module.exports = (function ()
{
    /**
     *  @template T
     *  @typedef {import("./equal-comparer").EqualComparer<T>} EqualComparer<T>
     */

    /**
     *  @template T
     *  @constructor
     *  @param {Iterable<T>} [iterable]
     *  @param {EqualComparer<T>} [comparer]
     */
    function ArraySet()
    {
        /**  @type {Iterable<T>} */var iterable = arguments[0];
        /**  @type {EqualComparer<T>} */var comparer = arguments[1];

        this._comparer = isFunction(comparer) ? comparer : _defaultEqualComparer;
        /**  @type {T[]} */this._elements = null;
        this.clear();

        if(isIterable(iterable))
        {
            setAppend(this, iterable);
            this.size = this.getElementCount();
        }
    }

    /**
     *  @template T
     *  @param {T[]} src
     *  @param {EqualComparer<T>} [comparer]
     */
    ArraySet.wrap = function wrap(src)
    {
        /** @type {ArraySet<T>} */var set = new ArraySet(null, arguments[1]);
        set.attach(src);

        return set;
    };

    ArraySet.prototype = {
        constructor : ArraySet,

        /**
         *  @param {T[]} arr
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
            return this._elements.length;
        },

        /**
         *  @param {number} index
         */
        getAt : function getAt(index)
        {
            return this._elements[index];
        },

        /**
         *  @param {number} index
         *  @param {T} element
         */
        setAt : function setAt(index, element)
        {
            this._elements[index] = element;
        },

        /**
         *  @param {Function} callback
         */
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

        /**
         *  @param {T} element
         *  @returns {boolean}
         */
        has : function has(element)
        {
            return this.indexOf(element) >= 0;
        },

        /**
         *  @param {Function} callback
         */
        findIndex : function findIndex(callback)
        {
            return this._elements.findIndex(callback, arguments[1]);
        },

        /**
         *  @param {T} element
         */
        indexOf : function indexOf(element)
        {
            /**  @type {EqualComparer<typeof element>} */var comparer = (isFunction(arguments[1]) ? arguments[1] : this._comparer);

            for(var index = -1, i = 0; index < 0 && i < this._elements.length; ++i)
            {
                if(comparer(this._elements[i], element))
                {
                    index = i;
                }
            }

            return index;
        },

        /**
         *  @param {T} element
         */
        add : function add(element)
        {
            _tryAdd(this, element);

            return this;
        },

        /**
         *  @param {T} element
         */
        addOrReplace : function addOrReplace(element)
        {
            var index = _tryAdd(this, element);
            if(index >= 0)
            {
                this.setAt(index, element);
            }

            return this;
        },

        /**
         *  @param {T} element
         *  @returns {boolean}
         */
        tryAdd : function tryAdd(element)
        {
            return _tryAdd(this, element) < 0;
        },

        /**
         *  @param {number} index
         *  @param {T} element
         */
        insertOrReplace : function insertOrReplace(index, element)
        {
            var existingElementIndex = this.indexOf(element);

            if(existingElementIndex < 0)
            {
                this._elements.splice(index, 0, element);

                ++this.size;
            }
            else
            {
                this.setAt(existingElementIndex, element);
            }

            return this;
        },

        /**
         *  @param {number} index
         */
        removeAt : function removeAt(index)
        {
            var result = (index < this._elements.length && index >= 0);

            if(result)
            {
                this._elements.splice(index, 1);

                --this.size;
            }

            return result;
        },

        /**
         *  @param {T} element
         *  @returns {boolean}
         */
        "delete" : function (element)
        {
            return this.del(element);
        },

        /**
         *  @param {T} element
         *  @returns {boolean}
         */
        del : function del(element)
        {
            return this.removeAt(this.indexOf(element));
        },

        clear : function clear()
        {
            /**  @type {T[]} */this._elements = [];
            this.size = 0;
        },

        toString : function toString()
        {
            return "ArraySet(" + this._elements.length + ") {" + this._elements.join(", ") + "}";
        },

        toJSON : function toJSON()
        {
            return _setToJSON(this);
        },

        toArray : function toArray()
        {
            return this._elements.slice();
        }
    };

    /**
     *  @template T
     *  @param {ArraySet<T>} thisRef
     *  @param {T} element
     */
    function _tryAdd(thisRef, element)
    {
        var index = thisRef.indexOf(element);

        if(index < 0)
        {
            thisRef._elements.push(element);

            ++thisRef.size;
        }

        return index;
    }

    if(isSymbolSupported())
    {
        ArraySet.prototype[Symbol.iterator] = ArraySet.prototype.values;

        ArraySet.prototype[Symbol.toStringTag] = "ArraySet";
    }

    return {
        ArraySet : ArraySet
    };
})();
