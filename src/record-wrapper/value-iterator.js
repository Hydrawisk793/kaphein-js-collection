module.exports = (function ()
{
    /**
     *  @constructor
     */
    function ValueIterator(map)
    {
        this._map = map;
        this._keys = Object.keys(this._map);
        this._keyIndex = 0;
    }

    ValueIterator.prototype = {
        constructor : ValueIterator,

        next : function next()
        {
            var key;
            var result = {
                value : void 0,
                done : this._keyIndex >= this._keys.length
            };

            if(!result.done)
            {
                key = this._keys[this._keyIndex];
                result.value = this._map[key];
                ++this._keyIndex;
            }

            return result;
        }
    };

    return {
        ValueIterator : ValueIterator
    }
})();
