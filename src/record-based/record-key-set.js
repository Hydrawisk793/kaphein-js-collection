var kapheinJsTypeTrait = require("kaphein-js-type-trait");
var isDefinedAndNotNull = kapheinJsTypeTrait.isDefinedAndNotNull;
var isNumber = kapheinJsTypeTrait.isNumber;
var isString = kapheinJsTypeTrait.isString;

var forOf = require("../for-of").forOf;
var isSymbolSupported = require("../is-symbol-supported").isSymbolSupported;
var _setToJSON = require("../to-json-impl")._setToJSON;

module.exports = (function ()
{
    var _isSymbolSupported = isSymbolSupported();
    var _hasOwnProperty = Object.prototype.hasOwnProperty;
    var _ownKeys = (
        ("undefined" !== typeof Reflect && Reflect.ownKeys)
        || Object.keys
    );

    /**
     *  @constructor
     *  @param {Iterable<string>} [iterable]
     */
    function RecordKeySet()
    {
        this._map = null;
        this.size = 0;

        this.clear();

        /** @type {Iterable<string>} */var iterable = arguments[0];
        if(isDefinedAndNotNull(iterable))
        {
            forOf(
                iterable,
                /**
                 *  @this {RecordKeySet}
                 */
                function (value)
                {
                    this.add(value);
                },
                this
            );
        }
    }

    RecordKeySet.prototype = {
        constructor : RecordKeySet,

        size : 0,

        /**
         *  @param {Function} callback
         *  @param {*} [thisArg]
         */
        forEach : function forEach(callback)
        {
            var thisArg = arguments[1];

            var keys = _ownKeys(this._map);
            for(var i = 0; i < keys.length; ++i)
            {
                var rec = this._map[keys[i]];
                for(var j = 0; j < 3; ++j)
                {
                    var v = rec[j];
                    if(null !== v)
                    {
                        callback.call(thisArg, v, v, this);
                    }
                }
            }
        },

        entries : function entries()
        {
            /**  @type {IterableIterator<[string, string]>} */var iterator = {
                next : function next()
                {
                    var result = {
                        value : void 0,
                        done : false
                    };

                    var found = false;
                    for(var loop = true; loop && this._index < this._keys.length; )
                    {
                        var rec = this._map[this._keys[this._index]];

                        for(; loop && this._subIndex < 3; ++this._subIndex)
                        {
                            var v = rec[this._subIndex];
                            if(null !== v)
                            {
                                result.value = [v, v];
                                found = true;
                                loop = false;
                            }
                        }
                        if(this._subIndex >= 3)
                        {
                            this._subIndex = 0;
                            ++this._index;
                        }
                    }

                    result.done = !found && this._index >= this._keys.length;

                    return result;
                }
            };
            iterator._map = this._map;
            iterator._keys = _ownKeys(this._map);
            iterator._index = 0;
            iterator._subIndex = 0;

            if(_isSymbolSupported)
            {
                iterator[Symbol.iterator] = function ()
                {
                    return this;
                };
            }

            return iterator;
        },

        values : function values()
        {
            /**  @type {IterableIterator<string>} */var iterator = {
                next : function next()
                {
                    var result = {
                        value : void 0,
                        done : false
                    };

                    var found = false;
                    for(var loop = true; loop && this._index < this._keys.length; )
                    {
                        var rec = this._map[this._keys[this._index]];

                        for(; loop && this._subIndex < 3; ++this._subIndex)
                        {
                            var v = rec[this._subIndex];
                            if(null !== v)
                            {
                                result.value = v;
                                found = true;
                                loop = false;
                            }
                        }
                        if(this._subIndex >= 3)
                        {
                            this._subIndex = 0;
                            ++this._index;
                        }
                    }

                    result.done = !found && this._index >= this._keys.length;

                    return result;
                }
            };
            iterator._map = this._map;
            iterator._keys = _ownKeys(this._map);
            iterator._index = 0;
            iterator._subIndex = 0;

            if(_isSymbolSupported)
            {
                iterator[Symbol.iterator] = function ()
                {
                    return this;
                };
            }

            return iterator;
        },

        /**
         *  @param {string} value
         *  @returns {boolean}
         */
        has : function has(value)
        {
            _assertIsValueAllowed(value);

            var result = _hasOwnProperty.call(this._map, value);
            if(result)
            {
                var rec = this._map[value];

                if(isNumber(value))
                {
                    result = null !== rec[0];
                }
                else if(isString(value))
                {
                    result = null !== rec[1];
                }
                else
                {
                    result = null !== rec[2];
                }
            }

            return result;
        },

        /**
         *  @param {string} value
         */
        add : function add(value)
        {
            _assertIsValueAllowed(value);

            if(!this.has(value))
            {
                var rec = this._map[value];
                if(!rec)
                {
                    rec = {
                        "0" : null,
                        "1" : null,
                        "2" : null
                    };
                    this._map[value] = rec;
                }

                if(isNumber(value))
                {
                    rec[0] = value;
                }
                else if(isString(value))
                {
                    rec[1] = value;
                }
                else
                {
                    rec[2] = value;
                }

                ++this.size;
            }

            return this;
        },

        /**
         *  @param {string} value
         */
        "delete" : function (value)
        {
            var exists = this.has(value);
            if(exists)
            {
                var rec = this._map[value];

                if(isNumber(value))
                {
                    rec[0] = null;
                }
                else if(isString(value))
                {
                    rec[1] = null;
                }
                else
                {
                    rec[2] = null;
                }

                if(
                    null === rec[0]
                    && null === rec[1]
                    && null === rec[2]
                )
                {
                    delete this._map[value];
                }

                --this.size;
            }

            return exists;
        },

        clear : function clear()
        {
            this._map = {};
            this.size = 0;
        },

        toJSON : function toJSON()
        {
            return _setToJSON(this);
        }
    };

    RecordKeySet.prototype.keys = RecordKeySet.prototype.values;

    if(_isSymbolSupported)
    {
        RecordKeySet.prototype[Symbol.iterator] = RecordKeySet.prototype.values;

        RecordKeySet.prototype[Symbol.toStringTag] = "RecordKeySet";
    }

    /**
     *  @param {any} v
     *  @returns {v is (number | string | symbol)}
     */
    function _isValueAllowed(v)
    {
        return (
            isNumber(v)
            || isString(v)
            || (_isSymbolSupported && "symbol" == typeof v)
        );
    }

    /**
     *  @param {any} v
     */
    function _assertIsValueAllowed(v)
    {
        if(!_isValueAllowed(v))
        {
            throw new TypeError("Only numbers, strings or symbols are allowed.");
        }
    }

    return {
        RecordKeySet : RecordKeySet
    };
})();
