var kapheinJsTypeTrait = require("kaphein-js-type-trait");
var isDefinedAndNotNull = kapheinJsTypeTrait.isDefinedAndNotNull;
var isString = kapheinJsTypeTrait.isString;

var forOf = require("../for-of").forOf;
var isSymbolSupported = require("../is-symbol-supported").isSymbolSupported;
var _setToJSON = require("../to-json-impl")._setToJSON;

module.exports = (function ()
{
    var _hasOwnProperty = Object.prototype.hasOwnProperty;
    var _isSymbolSupported = isSymbolSupported();

    /**
     *  @constructor
     *  @param {Iterable<string>} [iterable]
     */
    function StringSet()
    {
        this.clear();

        /** @type {Iterable<string>} */var iterable = arguments[0];
        if(isDefinedAndNotNull(iterable))
        {
            forOf(
                iterable,
                /**
                 *  @this {StringSet}
                 */
                function (value)
                {
                    this.add(value);
                },
                this
            );
        }
    }

    StringSet.prototype = {
        constructor : StringSet,

        size : 0,

        /**
         *  @param {Function} callback
         *  @param {*} [thisArg]
         */
        forEach : function forEach(callback)
        {
            var thisArg = arguments[1];

            var values = Object.keys(this._map);
            for(var i = 0; i < values.length; ++i)
            {
                var value = values[i];
                callback.call(thisArg, value, value, this);
            }
        },

        entries : function entries()
        {
            /**  @type {IterableIterator<[string, string]>} */var iterator = {
                next : function next()
                {
                    var done = this._index >= this._values.length;
                    var result = {
                        value : void 0,
                        done : done
                    };

                    if(!done)
                    {
                        var value = this._values[this._index];
                        result.value = [value, value];
                        ++this._index;
                    }

                    return result;
                }
            };
            iterator._values = Object.keys(this._map);
            iterator._index = 0;

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
                    var done = this._index >= this._values.length;
                    var result = {
                        value : (done ? void 0 : this._values[this._index]),
                        done : done
                    };

                    if(!done)
                    {
                        ++this._index;
                    }

                    return result;
                }
            };
            iterator._values = Object.keys(this._map);
            iterator._index = 0;

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
            if(!isString(value))
            {
                throw new TypeError("'value' must be a string.");
            }

            return _hasOwnProperty.call(this._map, value);
        },

        /**
         *  @param {string} value
         */
        add : function add(value)
        {
            if(!isString(value))
            {
                throw new TypeError("Only strings can be added.");
            }

            var exists = this.has(value);

            if(!exists)
            {
                this._map[value] = value;
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
                delete this._map[value];
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

    StringSet.prototype.keys = StringSet.prototype.values;

    if(_isSymbolSupported)
    {
        StringSet.prototype[Symbol.iterator] = StringSet.prototype.values;

        StringSet.prototype[Symbol.toStringTag] = "StringSet";
    }

    return {
        StringSet : StringSet
    };
})();
