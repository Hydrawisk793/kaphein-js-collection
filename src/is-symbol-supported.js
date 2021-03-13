module.exports = (function ()
{
    function isSymbolSupported()
    {
        return Symbol && "function" === typeof Symbol;
    }

    return {
        isSymbolSupported : isSymbolSupported
    };
})();
