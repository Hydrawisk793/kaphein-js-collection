const { expect } = require("chai");

const {
    RbTreeSet,
    RbTreeSearchTarget,
} = require("../../src");
const {
    nextInteger,
    nextIntegers,
    compareNumber,
} = require("../utils.test");
const setCommon = require("./set-common.test");

module.exports = function ()
{
    const elements = [
        10,
        5,
        1,
        3,
        7,
    ];

    (setCommon.bind(this))(RbTreeSet, [compareNumber], compareNumber, elements, "RbTreeSet");

    describe("has", function ()
    {
        it("should have all elements provided on the construction.", function ()
        {
            const set = new RbTreeSet(elements, compareNumber);

            for(let i of elements)
            {
                expect(set.has(i)).to.equal(true);
            }
        });
    });

    describe("add", function ()
    {
        it("should add a new element.", function ()
        {
            const set = new RbTreeSet(elements, compareNumber);
            const elem = 8;
            set.add(elem);
            expect(set.has(elem)).to.equal(true);
            expect(set.size).to.equal(elements.length + 1);
        });

        it("should not add a duplicate element.", function ()
        {
            const set = new RbTreeSet(elements, compareNumber);
            const elem = elements[0];
            set.add(elem);
            expect(set.has(elem)).to.equal(true);
            expect(set.size).to.equal(elements.length);
        });
    });

    describe("delete", function ()
    {
        it("should delete an element.", function ()
        {
            const set = new RbTreeSet(elements, compareNumber);
            const elem = elements[0];
            const result = set["delete"](elem);
            expect(result).to.equal(true);
            expect(set.has(elem)).to.equal(false);
            expect(set.size).to.equal(elements.length - 1);
        });

        it("should return false on trying to a not existing element.", function ()
        {
            const set = new RbTreeSet(elements, compareNumber);
            const elem = 20;
            const result = set["delete"](elem);
            expect(result).to.equal(false);
            expect(set.has(elem)).to.equal(false);
            expect(set.size).to.equal(elements.length);
        });
    });

    describe("findValue", function ()
    {
        it("should find a pair whose key is equal to the specified key.", function ()
        {
            const set = new RbTreeSet(elements, compareNumber);
            expect(set.findValue(99, RbTreeSearchTarget.equal)).to.be.undefined;
            expect(set.findValue(elements[3], RbTreeSearchTarget.equal)).to.equal(elements[3]);
        });

        it("should find a pair whose key is less than the specified key.", function ()
        {
            const set = new RbTreeSet(elements, compareNumber);
            expect(set.findValue(3, RbTreeSearchTarget.less)).to.equal(1);
            expect(set.findValue(2, RbTreeSearchTarget.less)).to.equal(1);
        });

        it("should find a pair whose key is less than or equal to the specified key.", function ()
        {
            const set = new RbTreeSet(elements, compareNumber);
            expect(set.findValue(3, RbTreeSearchTarget.lessOrEqual)).to.equal(3);
            expect(set.findValue(2, RbTreeSearchTarget.lessOrEqual)).to.equal(1);
        });

        it("should find a pair whose key is greater than the specified key.", function ()
        {
            const set = new RbTreeSet(elements, compareNumber);
            expect(set.findValue(5, RbTreeSearchTarget.greater)).to.equal(7);
            expect(set.findValue(6, RbTreeSearchTarget.greater)).to.equal(7);
        });

        it("should find a pair whose key is greater than or equal to the specified key.", function ()
        {
            const set = new RbTreeSet(elements, compareNumber);
            expect(set.findValue(5, RbTreeSearchTarget.greaterOrEqual)).to.equal(5);
            expect(set.findValue(6, RbTreeSearchTarget.greaterOrEqual)).to.equal(7);
        });
    });

    describe("getFirst", function ()
    {
        it("should return the first pair.", function ()
        {
            const set = new RbTreeSet(elements, compareNumber);
            expect(set.getFirst()).to.deep.equal((elements.sort(compareNumber))[0]);
            set.clear();
            expect(set.getFirst()).to.be.undefined;
        });
    });

    describe("getLast", function ()
    {
        it("should return the last pair.", function ()
        {
            const set = new RbTreeSet(elements, compareNumber);
            expect(set.getLast()).to.deep.equal((elements.sort(compareNumber))[elements.length - 1]);
            set.clear();
            expect(set.getLast()).to.be.undefined;
        });
    });

    describe("Stress test", function ()
    {
        it("should be sane.", function ()
        {
            this.timeout(0);

            const iterationCount = (8192 << 4);

            const iter = {
                _set : new RbTreeSet(null, compareNumber),
                _i : 0,
                _count : iterationCount,
                next : function next()
                {
                    const result = {
                        done : this._i >= this._count,
                        value : void 0
                    };

                    if(!result.done)
                    {
                        result.value = testTreeSetWithRandomIntegers(
                            this._set,
                            1, 80,
                            0, 99
                        );
                        result.value.loop = this._i;

                        ++this._i;
                    }

                    return result;
                }
            };
            if("function" === typeof Symbol && "iterator" in Symbol)
            {
                iter[Symbol.iterator] = function ()
                {
                    return this;
                };
            }

            for(let r of iter)
            {
                if(r.error)
                {
                    console.error("RbTreeSet", r.loop, r.output);

                    throw r.error;
                }
            }
        });
    });

    /**
     *  @param {number} min
     *  @param {number} max
     */
    function nextSize(min, max)
    {
        return nextInteger(min, max);
    }

    /**
     *  @param {number[]} items
     */
    function itemsAreInAscendingOrder(items)
    {
        for(var i = 0, j = 1; i < items.length; ++j, ++i)
        {
            if(items[i] > items[j])
            {
                return false;
            }
        }

        return true;
    }

    /**
     *  @param {RbTreeSet<number>} set
     *  @param {number[]} items
     */
    function testTreeSetWithIntegerArray(set, items)
    {
        var error = null;
        var outputStrs = [];

        try
        {
            var i, j;

            outputStrs.push("Input (" + items.length + ") : ");
            outputStrs.push(JSON.stringify(items));

            set.clear();

            for(i = 0; i < items.length; ++i)
            {
                set.add(items[i]);
            }

            var treeItems = Array.from(set);
            var treeItemCountAfterInsert = treeItems.length;
            outputStrs.push("After insertion (" + set.getElementCount() + ") : ");
            outputStrs.push(JSON.stringify(treeItems));

            var areInAscendingOrder = itemsAreInAscendingOrder(treeItems, treeItemCountAfterInsert);
            outputStrs.push("Ascending ordered : " + areInAscendingOrder);
            if(!areInAscendingOrder)
            {
                throw new Error(["areInAscendingOrder", areInAscendingOrder, JSON.stringify(items)].join(","));
            }

            var removeItems = [];
            for(j = nextSize(0, treeItemCountAfterInsert); j > 0; )
            {
                --j;
                do
                {
                    var item = treeItems[nextSize(0, treeItemCountAfterInsert - 1)];
                }
                while(removeItems.indexOf(item) >= 0);

                removeItems.push(item);
            }
            outputStrs.push("Removal targets (" + removeItems.length + ") : ");
            outputStrs.push(JSON.stringify(removeItems));

            for(j = removeItems.length; j > 0; )
            {
                --j;

                set["delete"](removeItems[j]);
            }
            outputStrs.push("After removal (" + set.getElementCount() + ") : ");
            outputStrs.push(JSON.stringify(Array.from(set)));

            var treeItemCountAfterRemove = set.getElementCount();
            var treeItemsAfterRemove = Array.from(set);
            var areInAscendingOrderAfterRemove = itemsAreInAscendingOrder(treeItemsAfterRemove);
            outputStrs.push("Ascending ordered : " + areInAscendingOrderAfterRemove);
            if(!areInAscendingOrderAfterRemove)
            {
                throw new Error(["areInAscendingOrderAfterRemove", areInAscendingOrderAfterRemove, JSON.stringify(items)].join(","));
            }

            var areCountsMatch = treeItemCountAfterInsert - removeItems.length === treeItemCountAfterRemove;
            outputStrs.push("" + areCountsMatch + " : " + treeItemCountAfterInsert + " - " + removeItems.length + " === " + treeItemCountAfterRemove);

            if(!areCountsMatch)
            {
                throw new Error(["areCountsMatch", areCountsMatch, JSON.stringify(items)].join(","));
            }
        }
        catch(xcept)
        {
            error = xcept;
        }

        return {
            output : outputStrs.join("\n"),
            error : error
        };
    }

    /**
     *  @param {RbTreeSet<number>} set
     *  @param {number} minItemCount
     *  @param {number} maxItemCount
     *  @param {number} minIntValue
     *  @param {number} maxIntValue
     */
    function testTreeSetWithRandomIntegers(
        set,
        minItemCount,
        maxItemCount,
        minIntValue,
        maxIntValue
    )
    {
        var inputItemCount = nextSize(minItemCount, maxItemCount);
        var inputItems = nextIntegers(inputItemCount, minIntValue, maxIntValue);

        return testTreeSetWithIntegerArray(set, inputItems);
    }
};
