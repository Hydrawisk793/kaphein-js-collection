require("core-js");
const { assert } = require("chai");

const { StringKeyTrie } = require("../../src");

module.exports = function ()
{
    const map = {
        "/foo" : "a",
        "/bar" : "b",
        "/foo/bar" : "b",
        "/foo/baz" : "c",
        "/foo/qux" : "d",
    };
    const sortedMap = Object.keys(map).sort().reduce(function (acc, key)
    {
        acc[key] = map[key];

        return acc;
    }, {});

    describe("constructor", function ()
    {
        it("should be empty on default", function ()
        {
            const trie = new StringKeyTrie();
            assert.equal(trie.size, 0);
        });

        it("should add iterable pairs", function ()
        {
            const trie1 = new StringKeyTrie(Object.entries(map));
            const trie2 = new StringKeyTrie();
            Object.entries(map).forEach(function (pair)
            {
                trie2.set(pair[0], pair[1]);
            });

            assert.equal(trie1.size, Object.keys(map).length);
            assert.equal(trie2.size, trie1.size);
        });
    });

    describe("hasPrefix", function ()
    {
        it("should determine whether prefixes are exist", function ()
        {
            const trie = new StringKeyTrie(Object.entries(map));
            const prefixes = Object
                .keys(map)
                .map(function (key)
                {
                    const prefixes = [];
                    for(let i = 0; i < key.length; ++i)
                    {
                        prefixes.push(key.substr(0, i + 1));
                    }

                    return prefixes;
                })
                .flat()
            ;
            assert.deepStrictEqual(prefixes.map((prefix) => trie.hasPrefix(prefix)), new Array(prefixes.length).fill(true));
        });
    });

    describe("getPrefixMap", function ()
    {
        it("should work", function ()
        {
            const trie = new StringKeyTrie(Object.entries(map));
            assert.containsAllDeepKeys(trie.getPrefixMap("/").toRecord(), Object.keys(map));
        });
    });

    describe("set", function ()
    {
        it("should add elements", function ()
        {
            const mapEntires = Object.entries(map);

            const trie = new StringKeyTrie(mapEntires);

            assert.equal(trie.size, mapEntires.length);
            mapEntires.forEach(function (pair)
            {
                assert.isTrue(trie.has(pair[0]));
                assert.equal(trie.get(pair[0]), pair[1]);
            });
        });

        it("should sort branches by keys", function ()
        {
            const trie = new StringKeyTrie(Object.entries(map));
            assert.deepStrictEqual(trie.getPrefixMap("/").toRecord(), sortedMap);
        });
    });

    describe("delete", function ()
    {
        const trie = new StringKeyTrie(Object.entries(map));

        it("should delete nodes", function ()
        {
            const deleteResults = [];
            Object.keys(map).forEach(function (key)
            {
                deleteResults.push(trie.delete(key));
            });
            assert.equal(trie.size, 0);
            assert.deepStrictEqual(deleteResults, new Array(Object.keys(map).length).fill(true));
        });
    });

    describe("clear", function ()
    {
        it("should delete all", function ()
        {
            const trie = new StringKeyTrie(Object.entries(map));
            trie.clear();
            assert.equal(trie.size, 0);
        });
    });

    describe("entries", function ()
    {
        it("should iterate key-value pairs in sorted order", function ()
        {
            const trie = new StringKeyTrie(Object.entries(map));
            const pairs = [];
            for(const pair of trie.entries())
            {
                pairs.push(pair);
            }
            assert.deepStrictEqual(pairs, Object.entries(sortedMap));
        });
    });

    describe("keys", function ()
    {
        it("should iterate key-value pairs in sorted order", function ()
        {
            const trie = new StringKeyTrie(Object.entries(map));
            const pairs = [];
            for(const pair of trie.keys())
            {
                pairs.push(pair);
            }
            assert.deepStrictEqual(pairs, Object.keys(sortedMap));
        });
    });

    describe("values", function ()
    {
        it("should iterate key-value pairs in sorted order", function ()
        {
            const trie = new StringKeyTrie(Object.entries(map));
            const pairs = [];
            for(const pair of trie.values())
            {
                pairs.push(pair);
            }
            assert.deepStrictEqual(pairs, Object.values(sortedMap));
        });
    });

    describe("Symbol.iterator", function ()
    {
        it("should iterate key-value pairs in sorted order", function ()
        {
            const trie = new StringKeyTrie(Object.entries(map));
            const pairs = [];
            for(const pair of trie)
            {
                pairs.push(pair);
            }
            assert.deepStrictEqual(pairs, Object.entries(sortedMap));
        });
    });

    /**
     *  @template T
     *  @param {Trie<T>} trie
     */
    // eslint-disable-next-line no-unused-vars
    function _stringifyTrie(trie)
    {
        return JSON.stringify(trie._root, function (key, value)
        {
            return key === "parent" ? void 0 : value;
        }, 2)
    }
};
