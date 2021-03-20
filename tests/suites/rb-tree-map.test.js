const { assert } = require("chai");

const {
    RbTreeMap,
    RbTreeSearchTarget,
} = require("../../src");
const { compareString } = require("../utils.test");
const mapCommon = require("./map-common.test");

module.exports = function ()
{
    const pairs = [
        ["bab", 13],
        ["foo", 1],
        ["bar", 2],
        ["baz", 3],
        ["aaa", 4],
    ];

    (mapCommon.bind(this))(RbTreeMap, [compareString], comparePair, pairs, "RbTreeMap");

    (function ()
    {
        const pairs = [
            ["foo", 1],
            ["bar", 2],
            ["baz", 3],
            ["aaa", 4],
        ];
        const modifiedPair = ["baz", 102];
        const map = new RbTreeMap(pairs, compareString);

        describe("set", function ()
        {
            it("should set new key-value pairs.", function ()
            {
                const sortedPairs = pairs.slice().sort(function (l, r)
                {
                    return compareString(l[0], r[0]);
                });

                pairs.forEach((pair) => map.set(pair[0], pair[1]));
                assert.deepStrictEqual(Array.from(map), sortedPairs);

                map.set(modifiedPair[0], modifiedPair[1]);
                assert.equal(map.size, pairs.length);

                const arb = ["arb", 123123123];
                const bab = ["bab", 13];
                map.set(arb[0], arb[1]);
                map.set(bab[0], bab[1]);
                assert.equal(map.size, pairs.length + 2);
            });
        });

        describe("delete", function ()
        {
            it("should delete pairs by keys.", function ()
            {
                map["delete"](modifiedPair[0]);
                assert.equal(map.size, pairs.length + 1);
            });
        });
    })();

    describe("findEntry", function ()
    {
        it("should find a pair whose key is equal to the specified key.", function ()
        {
            const record = pairs.reduce(function (acc, pair)
            {
                acc[pair[0]] = pair[1];

                return acc;
            }, {});

            const map = new RbTreeMap(pairs, compareString);
            assert.notExists(map.findEntry("bac", RbTreeSearchTarget.equal));
            assert.deepStrictEqual(map.findEntry("bar", RbTreeSearchTarget.equal), ["bar", record["bar"]]);
        });

        it("should find a pair whose key is less than the specified key.", function ()
        {
            const map = new RbTreeMap(pairs, compareString);
            assert.deepStrictEqual(map.findEntry("bac", RbTreeSearchTarget.less), ["bab", map.get("bab")]);
            assert.deepStrictEqual(map.findEntry("bar", RbTreeSearchTarget.less), ["bab", map.get("bab")]);
        });

        it("should find a pair whose key is less than or equal to the specified key.", function ()
        {
            const map = new RbTreeMap(pairs, compareString);
            assert.deepStrictEqual(map.findEntry("bac", RbTreeSearchTarget.lessOrEqual), ["bab", map.get("bab")]);
            assert.deepStrictEqual(map.findEntry("bar", RbTreeSearchTarget.lessOrEqual), ["bar", map.get("bar")]);
        });

        it("should find a pair whose key is greater than the specified key.", function ()
        {
            const map = new RbTreeMap(pairs, compareString);
            assert.deepStrictEqual(map.findEntry("bac", RbTreeSearchTarget.greater), ["bar", map.get("bar")]);
            assert.deepStrictEqual(map.findEntry("bar", RbTreeSearchTarget.greater), ["baz", map.get("baz")]);
        });

        it("should find a pair whose key is greater than or equal to the specified key.", function ()
        {
            const map = new RbTreeMap(pairs, compareString);
            assert.deepStrictEqual(map.findEntry("bac", RbTreeSearchTarget.greaterOrEqual), ["bar", map.get("bar")]);
            assert.deepStrictEqual(map.findEntry("bar", RbTreeSearchTarget.greaterOrEqual), ["bar", map.get("bar")]);
        });
    });

    describe("getFirst", function ()
    {
        it("should return the first pair.", function ()
        {
            const map = new RbTreeMap(pairs, compareString);
            assert.deepStrictEqual(map.getFirst(), ["aaa", map.get("aaa")]);
            map.clear();
            assert.isUndefined(map.getFirst());
        });
    });

    describe("getLast", function ()
    {
        it("should return the last pair.", function ()
        {
            const map = new RbTreeMap(pairs, compareString);
            assert.deepStrictEqual(map.getLast(), ["foo", map.get("foo")]);
            map.clear();
            assert.isUndefined(map.getLast());
        });
    });

    /**
     *  @param {[string, any]} l
     *  @param {[string, any]} r
     */
    function comparePair(l, r)
    {
        return compareString(l[0], r[0]);
    }
};
