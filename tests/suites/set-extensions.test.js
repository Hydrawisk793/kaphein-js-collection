const { expect } = require("chai");

const {
    append,
    exclude,
    difference,
    intersection,
} = require("../../src");

module.exports = function ()
{
    describe("append", function ()
    {
        it("should add elements in the other.", function ()
        {
            const elems = [1, 2, 3, 4, 5];
            const set = new Set(elems);
            const otherElems = [2, 5, 7, 9];
            append(set, otherElems);

            expect(Array.from(set)).to.include.deep.members(Array.from(new Set([...elems, ...otherElems])));
        });
    });

    describe("exclude", function ()
    {
        it("should remove elements in the other.", function ()
        {
            const elems = [1, 2, 3, 4, 5];
            const set = new Set(elems);
            const otherElems = [2, 5, 7, 9];
            exclude(set, otherElems);

            expect(Array.from(set)).not.to.include.deep.members([2, 5]);
        });
    });

    describe("difference", function ()
    {
        it("should return elements that are only in the left side.", function ()
        {
            const lhs = new Set([1, 2, 3, 4, 5]);
            const rhs = new Set([-1, 2, 3, 4, -5]);
            expect(difference(lhs, rhs)).to.deep.equal([1, 5]);
        });
    });

    describe("intersection", function ()
    {
        it("should return elements that are in both sets.", function ()
        {
            const lhs = new Set([1, 2, 3, 4, 5]);
            const rhs = new Set([-1, 2, 3, 4, -5]);
            expect(intersection(lhs, rhs)).to.deep.equal([2, 3, 4]);
        });
    });
};
