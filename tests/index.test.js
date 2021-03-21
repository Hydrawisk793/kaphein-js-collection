require("core-js");

describe("kaphein-js-collection", function ()
{
    describe("forOf", require("./suites/for-of.test").bind(this));
    describe("forAwaitOf", require("./suites/for-await-of.test").bind(this));
    describe("coerceToArray", require("./suites/coerce-to-array.test").bind(this));
    describe("flatten", require("./suites/flatten.test").bind(this));
    describe("setExtensions", require("./suites/set-extensions.test").bind(this));
    describe("ArrayQueue", require("./suites/array-queue.test").bind(this));
    describe("ListQueue", require("./suites/list-queue.test").bind(this));
    describe("RbTreeSet", require("./suites/rb-tree-set.test").bind(this));
    describe("RbTreeMap", require("./suites/rb-tree-map.test").bind(this));
    describe("RecordKeySet", require("./suites/record-key-set.test").bind(this));
    describe("StringKeyTrie", require("./suites/string-key-trie.test").bind(this));
});
