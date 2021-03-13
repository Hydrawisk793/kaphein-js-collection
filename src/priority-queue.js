var kapheinJsTypeTrait = require("kaphein-js-type-trait");
var isFunction = kapheinJsTypeTrait.isFunction;

module.exports = (function ()
{
    var _rootIndex = 1;

    var nilNode = {};

    /**
     *  @template T
     *  @constructor
     *  @param {import("./comparer").Comparer<T>} comparer
     *  @param {boolean} [allowDuplicates]
     */
    function PriorityQueue(comparer)
    {
        if(!isFunction(comparer))
        {
            throw new TypeError("'comparer' must satisfy 'karbonator.comparer'.");
        }

        this._comparer = comparer;
        this._allowDuplicates = !!arguments[1];
        this._elementCount = 0;
        /**  @type {T[]} */this._nodes = [nilNode];
    }

    PriorityQueue.prototype = {
        getElementCount : function getElementCount()
        {
            return this._elementCount;
        },

        isEmpty : function isEmpty()
        {
            return this._elementCount < 1;
        },

        isFull : function isFull()
        {
            return this._elementCount >= Number.MAX_SAFE_INTEGER;
        },

        peek : function peek()
        {
            if(this.isEmpty())
            {
                throw new Error("The queue has no element.");
            }

            return this._nodes[_rootIndex];
        },

        /**
         *  @param {T} e
         */
        enqueue : function enqueue(e)
        {
            if(this.isFull())
            {
                throw new Error("The queue is full.");
            }

            if(
                this._allowDuplicates
                || this._nodes.findIndex(
                    /**
                     *  @template T
                     *  @this {PriorityQueue<T>}
                     */
                    function (elem)
                    {
                        return nilNode !== elem && 0 === this._comparer(elem, e);
                    },
                    this
                ) < 0
            )
            {
                this._nodes.push(e);
                ++this._elementCount;

                _constructHeapBottomUp(this, this._elementCount);
            }

            return this;
        },

        dequeue : function dequeue()
        {
            if(this.isEmpty())
            {
                throw new Error("The queue has no element.");
            }

            var rootNdx = _rootIndex;
            var elem = this._nodes[rootNdx];
            this._nodes[rootNdx] = this._nodes[this._elementCount];
            --this._elementCount;

            _constructHeapTopDown(this, rootNdx);

            this._nodes.pop();

            return elem;
        },

        clear : function clear()
        {
            this._nodes = [nilNode];
            this._elementCount = 0;
        }
    };

    /**
     *  @template T
     *  @param {PriorityQueue<T>} thisRef
     *  @param {number} targetIndex
     */
    function _constructHeapBottomUp(thisRef, targetIndex)
    {
        var parentIndex = 0;
        var target = thisRef._nodes[targetIndex];

        while(targetIndex > 0)
        {
            parentIndex = targetIndex >> 1;
            if(0 === parentIndex)
            {
                break;
            }

            if(thisRef._comparer(thisRef._nodes[parentIndex], target) > 0)
            {
                thisRef._nodes[targetIndex] = thisRef._nodes[parentIndex];

                targetIndex = parentIndex;
            }
            else
            {
                break;
            }
        }

        thisRef._nodes[targetIndex] = target;
    }

    /**
     *  @template T
     *  @param {PriorityQueue<T>} thisRef
     *  @param {number} targetIndex
     */
    function _constructHeapTopDown(thisRef, targetIndex)
    {
        var childIndex = 0;
        var target = thisRef._nodes[targetIndex];

        for(; ; )
        {
            childIndex = targetIndex << 1;
            if(childIndex > thisRef._elementCount)
            {
                break;
            }

            if(
                childIndex + 1 <= thisRef._elementCount
                && thisRef._comparer(thisRef._nodes[childIndex], thisRef._nodes[childIndex + 1]) > 0
            )
            {
                ++childIndex;
            }

            if(thisRef._comparer(target, thisRef._nodes[childIndex]) > 0)
            {
                thisRef._nodes[targetIndex] = thisRef._nodes[childIndex];

                targetIndex = childIndex;
            }
            else
            {
                break;
            }
        }

        thisRef._nodes[targetIndex] = target;
    }

    return {
        PriorityQueue : PriorityQueue
    };
})();
