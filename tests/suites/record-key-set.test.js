const { expect } = require("chai");

const { RecordKeySet } = require("../../src");
const { compareRecordKey } = require("../utils.test");
const setCommon = require("./set-common.test");

module.exports = function ()
{
    const elements = [0, "0", 0.5, "0.5", Symbol("foo"), "bar", 3.5];

    (setCommon.bind(this))(RecordKeySet, [compareRecordKey], compareRecordKey, elements, "RecordKeySet");

    describe("has", function ()
    {
        it("should distinguish a number literal from a string literal.", function ()
        {
            const set = new RecordKeySet([1]);
            expect(set.has(1)).to.equal(true);
            expect(set.has("1")).to.equal(false);
        });
    });

    describe("add", function ()
    {
        it("should distinguish a number literal from a string literal.", function ()
        {
            const set = new RecordKeySet();
            set.add(1);
            expect(set.size).to.equal(1);
            set.add("1");
            expect(set.size).to.equal(2);
            expect(Array.from(set).sort(compareRecordKey)).to.deep.equal([1, "1"].sort(compareRecordKey));
        });
    });

    describe("delete", function ()
    {
        it("should distinguish a number literal from a string literal.", function ()
        {
            const set = new RecordKeySet([1, "1"]);
            set["delete"](1);
            expect(set.has(1)).to.equal(false);
            expect(set.has("1")).to.equal(true);
        });
    });
};
