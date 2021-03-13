module.exports = (function ()
{
    /**
     *  @readonly
     *  @enum {number}
     */
    var RbTreeSearchTarget = {
        less : 0,
        lessOrEqual : 1,
        greater : 2,
        greaterOrEqual : 3,
        equal : 4
    };

    return {
        RbTreeSearchTarget : RbTreeSearchTarget
    };
})();
