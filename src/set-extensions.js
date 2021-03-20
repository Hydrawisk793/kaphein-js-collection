var forOf = require("./for-of").forOf;

module.exports = (function ()
{
    /**
     *  @template T
     *  @param {Set<T>} setObj
     *  @param {Iterable<T>} other
     */
    function append(setObj, other)
    {
        forOf(
            other,
            /**
             *  @this {typeof setObj} 
             */
            function (value)
            {
                this.add(value);
            },
            setObj,
            "values"
        );

        return setObj;
    }

    /**
     *  @template T
     *  @param {Set<T>} setObj
     *  @param {Iterable<T>} other
     */
    function exclude(setObj, other)
    {
        forOf(
            other,
            /**
             *  @this {typeof setObj} 
             */
            function (value)
            {
                this["delete"](value);
            },
            setObj,
            "values"
        );

        return setObj;
    }

    /**
     *  @template T
     *  @param {Set<T>} setObj
     *  @param {Set<T>} other
     *  @returns {Iterable<T>}
     */
    function difference(setObj, other)
    {
        var results = [];

        for(
            var i = setObj.values(), iP = i.next();
            !iP.done;
            iP = i.next()
        )
        {
            if(!other.has(iP.value))
            {
                results.push(iP.value);
            }
        }

        return results;
    }

    /**
     *  @template T
     *  @param {Set<T>} setObj
     *  @param {Set<T>} other
     *  @returns {Iterable<T>}
     */
    function intersection(setObj, other)
    {
        var results = [];

        for(
            var i = other.values(), iP = i.next();
            !iP.done;
            iP = i.next()
        )
        {
            if(setObj.has(iP.value))
            {
                results.push(iP.value);
            }
        }

        return results;
    }

    return {
        append : append,
        exclude : exclude,
        difference : difference,
        intersection : intersection
    };
})();
