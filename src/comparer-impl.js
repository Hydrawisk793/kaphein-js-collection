module.exports = (function ()
{
    /**
     *  @template T
     *  @param {T} lhs
     *  @param {T} rhs
     */
    function _defaultEqualComparer(lhs, rhs)
    {
        return lhs === rhs;
    }

    return {
        _defaultEqualComparer : _defaultEqualComparer
    };
})();
