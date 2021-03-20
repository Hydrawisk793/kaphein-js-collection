const { expect } = require("chai");

const { flatten } = require("../../src");

module.exports = function ()
{
    it("should flatten an array.", function ()
    {
        const arr = [0, 1, 2, [[[3, 4]]]];
        const expected = [0, 1, 2, 3, 4];
        expect(flatten(arr)).to.deep.equal(expected);
    });

    it("should flatten an array with a depth parameter.", function ()
    {
        const kases = [
            {
                value : [0, 1, 2, [[[3, 4]]]],
                depth : 2,
                expected : [0, 1, 2, [3, 4]],
            },
            {
                value : [1, 2, [3, 4, [5, 6]]],
                depth : 1,
                expected : [1, 2, 3, 4, [5, 6]],
            },
            {
                value : [1, 2, [3, 4, [5, 6]]],
                depth : 2,
                expected : [1, 2, 3, 4, 5, 6],
            },
            {
                value : [1, [2], [[3], 4], [5, 6]],
                depth : 1,
                expected : [1, 2, [3], 4, 5, 6],
            },
            {
                value : [1, [2], [[3], 4], [5, 6]],
                depth : 2,
                expected : [1, 2, 3, 4, 5, 6],
            },
        ];
        kases.forEach(function (kase)
        {
            expect(flatten(kase.value, kase.depth)).to.deep.equal(kase.expected);
        });
    });

    it("should remove empty holes.", function ()
    {
        // eslint-disable-next-line no-sparse-arrays
        const arr = [0, 1, , , 4];
        const expected = [0, 1, 4];
        expect(flatten(arr)).to.deep.equal(expected);
    });
};
