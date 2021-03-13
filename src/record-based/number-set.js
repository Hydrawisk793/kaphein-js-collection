var kapheinJsTypeTrait = require("kaphein-js-type-trait");
var isDefinedAndNotNull = kapheinJsTypeTrait.isDefinedAndNotNull;
var isNumber = kapheinJsTypeTrait.isNumber;
var isArray = kapheinJsTypeTrait.isArray;
var isIterable = kapheinJsTypeTrait.isIterable;

var isSymbolSupported = require("../is-symbol-supported").isSymbolSupported;
var _setToJSON = require("../to-json-impl")._setToJSON;

module.exports = (function ()
{
    var _hasOwnProperty = Object.prototype.hasOwnProperty;
    var _isSymbolSupported = isSymbolSupported();

    /**
     *  @constructor
     *  @param {Iterable<number>} [iterable]
     */
    function NumberSet()
    {
        this.clear();

        var iterable = arguments[0];
        if(isDefinedAndNotNull(iterable))
        {
            if(isArray(iterable))
            {
                for(var i = 0; i < iterable.length; ++i)
                {
                    this.add(iterable[i]);
                }
            }
            else if(isIterable(iterable))
            {
                var iter = iterable[Symbol.iterator]();
                for(var iterResult = iter.next(); !iterResult.done; iterResult = iter.next())
                {
                    this.add(iterResult.value);
                }
            }
            else
            {
                throw new TypeError("The argument must be an iterable.");
            }
        }
    }

    NumberSet.prototype = {
        constructor : NumberSet,

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
                var value = Number(values[i]);
                callback.call(thisArg, value, value, this);
            }
        },

        entries : function entries()
        {
            /**  @type {IterableIterator<[number, number]>} */var iterator = {
                next : function next()
                {
                    var done = this._index >= this._values.length;
                    var result = {
                        value : void 0,
                        done : done
                    };

                    if(!done)
                    {
                        var value = Number(this._values[this._index]);
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
            /**  @type {IterableIterator<number>} */var iterator = {
                next : function next()
                {
                    var done = this._index >= this._values.length;
                    var result = {
                        value : (done ? void 0 : Number(this._values[this._index])),
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
         *  @param {number} value
         *  @returns {boolean}
         */
        has : function has(value)
        {
            if(!isNumber(value))
            {
                throw new TypeError("'value' must be a number.");
            }

            return _hasOwnProperty.call(this._map, value);
        },

        /**
         *  @param {number} value
         */
        add : function add(value)
        {
            if(!isNumber(value))
            {
                throw new TypeError("Only numbers can be added.");
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
         *  @param {number} value
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

    NumberSet.prototype.keys = NumberSet.prototype.values;

    if(_isSymbolSupported)
    {
        NumberSet.prototype[Symbol.iterator] = NumberSet.prototype.values;

        NumberSet.prototype[Symbol.toStringTag] = "NumberSet";
    }

    return {
        NumberSet : NumberSet
    };
})();
