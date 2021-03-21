require("core-js");

describe("kaphein-js-collection", function ()
{
    describe("ArrayQueue", require("./suites/array-queue.test").bind(this));
    describe("ListQueue", require("./suites/list-queue.test").bind(this));
    describe("RbTreeSet", require("./suites/rb-tree-set.test").bind(this));
    describe("RbTreeMap", require("./suites/rb-tree-map.test").bind(this));
    describe("StringKeyTrie", require("./suites/string-key-trie.test").bind(this));
});
