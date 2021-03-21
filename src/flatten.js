var kapheinJsTypeTrait = require("kaphein-js-type-trait");
var isArray = kapheinJsTypeTrait.isArray;

module.exports = (function ()
{
    /**
     *  @template A
     *  @template {number} D
     *  @typedef {import("./index").FlattenArray<A, D>} FlattenArray
     */

    /**
     *  @template A
     *  @template {number} D
     *  @param {A} v
     *  @param {D} [depth]
     *  @returns {FlattenArray<A, D>[]}
     */
    function flatten(v)
    {
        var depth = arguments[1];
        if(Number.isSafeInteger(depth))
        {
            if(depth < 0)
            {
                throw new RangeError("'depth' must be a positive safe integer.");
            }
        }
        else
        {
            depth = null;
        }

        var _isArray = Array.isArray || isArray;
        var items = [];
        var ctxStack = [
            {
                value : v,
                depth : 0
            }
        ];
        while(ctxStack.length > 0)
        {
            var ctx = ctxStack.pop();
            var value = ctx.value;
            if((null === depth || depth >= ctx.depth) && _isArray(value))
            {
                var nextDepth = ctx.depth + 1;
                for(var i = 0, j = value.length; i < value.length; ++i)
                {
                    --j;
                    if(j in value)
                    {
                        ctxStack.push({
                            value : value[j],
                            depth : nextDepth
                        });
                    }
                }
            }
            else
            {
                items.push(value);
            }
        }

        return items;
    }

    return {
        flatten : flatten
    };
})();
