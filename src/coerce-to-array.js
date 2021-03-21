var kapheinJsTypeTrait = require("kaphein-js-type-trait");
var isArray = kapheinJsTypeTrait.isArray;

module.exports = (function ()
{
    /**
     *  @template T
     *  @param {T | T[]} v
     *  @returns {T[]}
     */
    function coerceToArray(v)
    {
        return ((Array.isArray || isArray)(v) ? v : [v]);
    }

    return {
        coerceToArray : coerceToArray
    };
})();
