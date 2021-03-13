const ArrayQueueTest = require("./suites/array-queue.test");
const ListQueueTest = require("./suites/list-queue.test");
const RbTreeSetTest = require("./suites/rb-tree-set.test");
const RbTreeMapTest = require("./suites/rb-tree-map.test");
const StringKeyTrieTest = require("./suites/string-key-trie.test");

describe("kaphein-js-collection", function ()
{
    describe("ArrayQueue", ArrayQueueTest.bind(this));
    describe("ListQueue", ListQueueTest.bind(this));
    describe("RbTreeSet", RbTreeSetTest.bind(this));
    describe("RbTreeMap", RbTreeMapTest.bind(this));
    describe("StringKeyTrie", StringKeyTrieTest.bind(this));
});
