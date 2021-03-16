var kapheinJsTypeTrait = require("kaphein-js-type-trait");
var isIterable = kapheinJsTypeTrait.isIterable;
var isString = kapheinJsTypeTrait.isString;

var _mapToJSON = require("../to-json-impl")._mapToJSON;
var isSymbolSupported = require("../is-symbol-supported").isSymbolSupported;
var ValueIterator = require("./value-iterator").ValueIterator;

module.exports = (function ()
{
    /**
     *  @template T
     *  @constructor
     */
    function StringKeyMap()
    {
        /** @type {Record<string, T>} */this._map = null;
        this.size = 0;

        this.clear();

        /** @type {Iterable<[string, T]>} */var iterable = arguments[0];
        if(isIterable(iterable))
        {
            Array.from(iterable).forEach(
                /**
                 *  @this {StringKeyMap<T>}
                 */
                function (pair)
                {
                    var key = pair[0];

                    _assertIsKeyString(key);

                    this.set(key, pair[1]);
                },
                this
            );
        }
    }

    /**
     *  @template T
     *  @param {Record<string, T>} src
     */
    StringKeyMap.wrap = function wrap(src)
    {
        var map = /**  @type {StringKeyMap<T>} */new StringKeyMap();
        map.attach(src);

        return map;
    };

    StringKeyMap.prototype = {
        constructor : StringKeyMap,

        attach : function attach(obj)
        {
            this._map = obj;
            this.size = this.getSize();
        },

        detach : function detach()
        {
            var old = this._map;

            this.clear();

            return old;
        },

        getSize : function getSize()
        {
            return Object.keys(this._map).length;
        },

        clear : function clear()
        {
            this._map = {};
            this.size = 0;
        },

        "delete" : function (key)
        {
            var hasKey = this.has(key);

            if(hasKey)
            {
                delete this._map[key];
                --this.size;
            }

            return hasKey;
        },

        entries : function entries()
        {
            return new PairIterator(this._map);
        },

        forEach : function forEach(callback)
        {
            var thisArg = arguments[1];

            var i, key;
            var keys = Object.keys(this._map);
            for(i = 0; i < keys.length; ++i)
            {
                key = keys[i];

                callback.call(thisArg, this.get(key), key, this);
            }
        },

        map : function map(callback)
        {
            var thisArg = arguments[1];

            var results = [];
            var i, key;
            var keys = Object.keys(this._map);
            for(i = 0; i < keys.length; ++i)
            {
                key = keys[i];

                results.push(callback.call(thisArg, this.get(key), key, this));
            }

            return results;
        },

        get : function get(key)
        {
            _assertIsKeyString(key);

            return this._map[key];
        },

        has : function has(key)
        {
            _assertIsKeyString(key);

            return _hasOwnProperty.call(this._map, key);
        },

        keys : function keys()
        {
            return new KeyIterator(this._map);
        },

        set : function set(key, value)
        {
            var hasKey = this.has(key);

            this._map[key] = value;
            if(!hasKey)
            {
                ++this.size;
            }

            return this;
        },

        values : function values()
        {
            return new ValueIterator(this._map);
        },

        toJSON : function toJSON()
        {
            return _mapToJSON(this);
        },

        /**
         *  @deprecated
         */
        toPlainObject : function toPlainObject()
        {
            return this.toRecord();
        },

        toRecord : function toRecord()
        {
            var i, key;
            var iter = this.keys();
            var plainObject = {};

            for(i = iter.next(); !i.done; i = iter.next())
            {
                key = String(i.value);

                plainObject[key] = this._map[key];
            }

            return plainObject;
        }
    };

    var _hasOwnProperty = Object.prototype.hasOwnProperty;

    function _assertIsKeyString(key)
    {
        if(!isString(key))
        {
            throw new TypeError("Only string keys are supported.");
        }
    }

    /**
     *  @constructor
     */
    function PairIterator(map)
    {
        this._map = map;
        this._keys = Object.keys(this._map);
        this._keyIndex = 0;
    }

    PairIterator.prototype = {
        constructor : PairIterator,

        next : function next()
        {
            var key;
            var result = {
                value : void 0,
                done : this._keyIndex >= this._keys.length
            };

            if(!result.done)
            {
                key = "" + this._keys[this._keyIndex];
                result.value = [key, this._map[key]];
                ++this._keyIndex;
            }

            return result;
        }
    };

    /**
     *  @constructor
     */
    function KeyIterator(map)
    {
        this._keys = Object.keys(map);
        this._keyIndex = 0;
    }

    KeyIterator.prototype = {
        constructor : KeyIterator,

        next : function next()
        {
            var result = {
                value : void 0,
                done : this._keyIndex >= this._keys.length
            };

            if(!result.done)
            {
                result.value = "" + this._keys[this._keyIndex];
                ++this._keyIndex;
            }

            return result;
        }
    };

    if(isSymbolSupported())
    {
        StringKeyMap.prototype[Symbol.iterator] = StringKeyMap.prototype.entries;

        StringKeyMap.prototype[Symbol.toStringTag] = "StringKeyMap";

        PairIterator.prototype[Symbol.iterator] = function ()
        {
            return this;
        };

        KeyIterator.prototype[Symbol.iterator] = function ()
        {
            return this;
        };

        ValueIterator.prototype[Symbol.iterator] = function ()
        {
            return this;
        };
    }

    return {
        StringKeyMap : StringKeyMap
    };
})();
