const { RbTreeSet } = require("../../src");

module.exports = function ()
{
    describe("RbTreeSet", function ()
    {
        it("test", function ()
        {
            testRbTreeSet();
        });
    });

    /**
     *  @param {number} min
     *  @param {number} max
     */
    function nextInt(min, max)
    {
        return Math.floor((Math.random() * (max - min))) + min;
    }

    /**
     *  @param {number} min
     *  @param {number} max
     */
    function nextSize(min, max)
    {
        return nextInt(min, max);
    }

    /**
     *  @param {number} count
     *  @param {number} min
     *  @param {number} max
     */
    function generateRandomIntegers(count, min, max)
    {
        var integers = [];
        for(var i = 0; i < count; ++i)
        {
            integers.push(nextInt(min, max));
        }

        return integers;
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
        var inputItems = generateRandomIntegers(inputItemCount, minIntValue, maxIntValue);

        return testTreeSetWithIntegerArray(set, inputItems);
    }

    function testRbTreeSet()
    {
        var interval = 5;

        var iter = {
            _set : new RbTreeSet(
                null,
                function (l, r)
                {
                    return l - r;
                }
            ),

            _i : 0,

            _iterationCount : 1024, // (8192 << 4),

            next : function next()
            {
                var result = {
                    done : this._i >= this._iterationCount,
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

        if(Symbol && "function" === typeof Symbol)
        {
            iter[Symbol.iterator] = function ()
            {
                return this;
            };
        }

        var timerId = setInterval(
            function ()
            {
                var result = iter.next();
                if(result.done)
                {
                    // console.log("DONE!");

                    clearInterval(timerId);
                }
                else
                {
                    if(null !== result.value.error)
                    {
                        console.error("===========================");
                        console.error("loop", result.value.loop);
                        console.error(result.value.output);
                        console.error(result.value.error.message);
                        console.error("===========================");

                        clearInterval(timerId);
                    }
                    // else if(result.value.loop % 256 === 0) {
                    //     console.log("loop", result.value.loop);
                    // }
                }
            },
            interval
        );

        return timerId;
    }
};
