var forOf = require("./utils").forOf;

module.exports = (function ()
{
    /**
     *  @template K, V
     *  @param {Map<K, V>} thisRef
     */
    function _setToJSON(thisRef)
    {
        /** @type {[V][]} */var result = [];
        forOf(thisRef.values(), /** @this {typeof result} */function (pair)
        {
            this.push(pair);
        }, result);

        return result;
    }

    /**
     *  @template K, V
     *  @param {Map<K, V>} thisRef
     */
    function _mapToJSON(thisRef)
    {
        /** @type {[K, V][]} */var result = [];
        forOf(thisRef.entries(), /** @this {typeof result} */function (pair)
        {
            this.push(pair);
        }, result);

        return result;
    }

    return {
        _setToJSON : _setToJSON,
        _mapToJSON : _mapToJSON
    };
})();
