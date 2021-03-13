const { assert } = require("chai");

const {
    RbTreeMap,
    RbTreeSearchTarget,
} = require("../../src");

module.exports = function ()
{
    describe("RbTreeMap", function ()
    {
        const pairs = [
            ["foo", 1],
            ["bar", 2],
            ["baz", 3],
            ["aaa", 4],
        ];
        const sortedPairs = pairs.slice().sort(function (l, r)
        {
            return compareString(l[0], r[0]);
        });
        const record = pairs.reduce(function (acc, pair)
        {
            acc[pair[0]] = pair[1];

            return acc;
        }, {});

        const map = new RbTreeMap(pairs, compareString);

        describe("construct", function ()
        {
            it("with no parameters", function ()
            {
                const map = new RbTreeMap();
                assert.equal(map.size, 0);
            });

            it("with null", function ()
            {
                const map = new RbTreeMap(null, compareString);
                assert.equal(map.size, 0);
            });

            it("with an iterable and a key comparer function", function ()
            {
                const map = new RbTreeMap(pairs, compareString);
                assert.deepStrictEqual(Array.from(map), sortedPairs);
                assert.equal(map.size, sortedPairs.length);
            });
        });

        describe("iterable", function ()
        {
            it("entries", function ()
            {
                assert.deepStrictEqual(Array.from(map.entries()), sortedPairs);
            });

            it("keys", function ()
            {
                assert.deepStrictEqual(Array.from(map.keys()), sortedPairs.map((pair) => pair[0]));
            });

            it("values", function ()
            {
                assert.deepStrictEqual(Array.from(map.values()), sortedPairs.map((pair) => pair[1]));
            });

            it("forEach", function ()
            {
                const pairs2 = [];
                map.forEach(
                    function (value, key)
                    {
                        pairs2.push([key, value]);
                    }
                );
                assert.deepStrictEqual(pairs2, sortedPairs);
            });

            it("forOf", function ()
            {
                const pairs2 = [];
                for(let p of map)
                {
                    pairs2.push(p);
                }
                assert.deepStrictEqual(pairs2, sortedPairs);
            });
        });

        describe("modification", function ()
        {
            const modifiedPair = ["baz", 102];

            it("clear", function ()
            {
                map.clear();
                assert.equal(map.size, 0);
            });

            it("set", function ()
            {
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

            it("delete", function ()
            {
                map["delete"](modifiedPair[0]);
                assert.equal(map.size, pairs.length + 1);

                const baz = ["baz", 8345];
                map.set(baz[0], baz[1]);
                assert.equal(map.size, pairs.length + 2);
            });
        });

        describe("getters", function ()
        {
            it("getFirst", function ()
            {
                assert.deepStrictEqual(map.getFirst(), ["aaa", map.get("aaa")]);
            });

            it("getLast", function ()
            {
                assert.deepStrictEqual(map.getLast(), ["foo", map.get("foo")]);
            });
        });

        describe("find", function ()
        {
            it("equal", function ()
            {
                assert.notExists(map.findEntry("bac", RbTreeSearchTarget.equal));
                assert.deepStrictEqual(map.findEntry("bar", RbTreeSearchTarget.equal), ["bar", record["bar"]]);
            });

            it("less", function ()
            {
                assert.deepStrictEqual(map.findEntry("bac", RbTreeSearchTarget.less), ["bab", map.get("bab")]);
                assert.deepStrictEqual(map.findEntry("bar", RbTreeSearchTarget.less), ["bab", map.get("bab")]);
            });

            it("less or equal", function ()
            {
                assert.deepStrictEqual(map.findEntry("bac", RbTreeSearchTarget.lessOrEqual), ["bab", map.get("bab")]);
                assert.deepStrictEqual(map.findEntry("bar", RbTreeSearchTarget.lessOrEqual), ["bar", map.get("bar")]);
            });

            it("greater", function ()
            {
                assert.deepStrictEqual(map.findEntry("bac", RbTreeSearchTarget.greater), ["bar", map.get("bar")]);
                assert.deepStrictEqual(map.findEntry("bar", RbTreeSearchTarget.greater), ["baz", map.get("baz")]);
            });

            it("greater or equal", function ()
            {
                assert.deepStrictEqual(map.findEntry("bac", RbTreeSearchTarget.greaterOrEqual), ["bar", map.get("bar")]);
                assert.deepStrictEqual(map.findEntry("bar", RbTreeSearchTarget.greaterOrEqual), ["bar", map.get("bar")]);
            });
        });
    });

    /**
     *  @param {string} l
     *  @param {string} r
     */
    function compareString(l, r)
    {
        return l.localeCompare(r);
    }
};
