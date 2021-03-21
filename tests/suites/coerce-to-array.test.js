const { expect } = require("chai");

const { coerceToArray } = require("../../src/coerce-to-array");

module.exports = function ()
{
    it("should convert non-arary values to arrays", function ()
    {
        expect(coerceToArray(void 0)).to.deep.equal([void 0]);
        expect(coerceToArray(null)).to.deep.equal([null]);
        expect(coerceToArray(3)).to.deep.equal([3]);
        expect(coerceToArray([3])).to.deep.equal([3]);
        expect(coerceToArray({})).to.deep.equal([{}]);
        expect(coerceToArray([{}])).to.deep.equal([{}]);
    });

    it("should convert an arary-like object to an array of array-like objects.", function ()
    {
        const arrayLikeObj = {
            length : 0,
        };
        arrayLikeObj[0] = "foo";
        arrayLikeObj[1] = 0.235;
        arrayLikeObj[2] = false;
        arrayLikeObj.length = 3;

        expect(coerceToArray(arrayLikeObj)).to.deep.equal([arrayLikeObj]);
    });
};
