var kapheinJsTypeTrait = require("kaphein-js-type-trait");
var isIterable = kapheinJsTypeTrait.isIterable;

var isSymbolSupported = require("./is-symbol-supported").isSymbolSupported;
var forOf = require("./for-of").forOf;

module.exports = (function ()
{
    /**
     *  @template T
     *  @constructor
     *  @param {Iterable<T>} [iterable]
     */
    function ListQueue()
    {
        /**  @type {ListNode<T>} */this._head = null;
        /**  @type {ListNode<T>} */this._tail = null;
        this.size = 0;

        /** @type {Iterable<T>} */var iterable = arguments[0];
        if(isIterable(iterable))
        {
            forOf(
                iterable,
                /**
                 *  @this {ListQueue<T>}
                 */
                function (element)
                {
                    this.enqueue(element);
                },
                this
            );
        }
    }

    ListQueue.prototype = {
        constructor : ListQueue,

        size : 0,

        isEmpty : function isEmpty()
        {
            return null === this._head;
        },

        isFull : function isFull()
        {
            return this.size >= Number.MAX_SAFE_INTEGER;
        },

        peek : function peek()
        {
            return (this.isEmpty() ? void 0 : this._head.element);
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

            var newNode = new ListNode(e, null);
            if(!this.isEmpty())
            {
                this._tail.next = newNode;
            }
            else
            {
                this._head = newNode;
            }
            this._tail = newNode;

            ++this.size;
        },

        dequeue : function dequeue()
        {
            var element = void 0;
            if(!this.isEmpty())
            {
                if(this._head !== this._tail)
                {
                    element = this._head.element;

                    this._head = this._head.next;
                }
                else
                {
                    element = this._tail.element;

                    this._head = null;
                    this._tail = null;
                }

                --this.size;
            }

            return element;
        },

        clear : function clear()
        {
            this._head = null;
            this._tail = null;
            this.size = 0;
        },

        forEach : function forEach(callback)
        {
            var thisArg = arguments[1];

            for(var i = 0, current = this._head; current; ++i, current = current.next)
            {
                callback.call(thisArg, current.element, i, this);
            }
        },

        /**
         *  @returns {Iterator<[number, T]>}
         */
        entries : function entries()
        {
            return new PairIterator(this, this._head);
        },

        /**
         *  @returns {Iterator<number>}
         */
        keys : function keys()
        {
            return new KeyIterator(this, this._head);
        },

        /**
         *  @returns {Iterator<T>}
         */
        values : function values()
        {
            return new ValueIterator(this._head);
        },

        toString : function toString()
        {
            var str = "[";

            var iter = this[Symbol.iterator]();
            var pair = iter.next();
            if(!pair.done)
            {
                str += pair.value;
            }

            for(pair = iter.next(); !pair.done; pair = iter.next())
            {
                str += ",";
                str += pair.value;
            }

            str += "]";

            return str;
        }
    };

    /**
     *  @template T
     *  @constructor
     *  @param {T} element
     *  @param {ListNode<T>} next
     */
    function ListNode(element, next)
    {
        this.element = element;
        this.next = next;
    }

    ListNode.prototype = {
        constructor : ListNode
    };

    /**
     *  @template T
     *  @constructor
     *  @param {ListQueue<T>} q
     *  @param {ListNode<T>} node
     */
    function PairIterator(q, node)
    {
        this._current = node;
        this._index = ListQueue_nodeIndexOf(q, node);
    }

    PairIterator.prototype = {
        constructor : PairIterator,

        /**
         *  @returns {IteratorResult<[number, T]>}
         */
        next : function next()
        {
            var done = this._index >= 0 && !this._current;
            var out = {
                value : (done ? void 0 : [this._index, this._current.element]),
                done : done
            };

            if(!done)
            {
                this._current = this._current.next;
                ++this._index;
            }

            return out;
        }
    };

    /**
     *  @template T
     *  @constructor
     *  @param {ListQueue<T>} q
     *  @param {ListNode<T>} node
     */
    function KeyIterator(q, node)
    {
        this._current = node;
        this._index = ListQueue_nodeIndexOf(q, node);
    }

    KeyIterator.prototype = {
        constructor : KeyIterator,

        /**
         *  @returns {IteratorResult<number>}
         */
        next : function next()
        {
            var done = this._index >= 0 && !this._current;
            var out = {
                value : (done ? void 0 : this._index),
                done : done
            };

            if(!done)
            {
                this._current = this._current.next;
                ++this._index;
            }

            return out;
        }
    };

    /**
     *  @template T
     *  @constructor
     *  @param {ListNode<T>} node
     */
    function ValueIterator(node)
    {
        this._current = node;
    }

    ValueIterator.prototype = {
        constructor : ValueIterator,

        /**
         *  @returns {IteratorResult<T>}
         */
        next : function next()
        {
            var done = !this._current;
            var out = {
                value : (done ? void 0 : this._current.element),
                done : done
            };

            if(!done)
            {
                this._current = this._current.next;
            }

            return out;
        }
    };

    if(isSymbolSupported())
    {
        ListQueue.prototype[Symbol.iterator] = ListQueue.prototype.values;

        ListQueue.prototype[Symbol.toStringTag] = "ListQueue";

        var returnThis = function ()
        {
            return this;
        };

        PairIterator.prototype[Symbol.iterator] = returnThis;

        KeyIterator.prototype[Symbol.iterator] = returnThis;

        ValueIterator.prototype[Symbol.iterator] = returnThis;
    }

    /**
     *  @template T
     *  @param {ListQueue<T>} thisRef
     *  @param {ListNode<T>} target
     */
    function ListQueue_nodeIndexOf(thisRef, target)
    {
        var index = 0;
        for(
            var current = thisRef._head;
            current && current !== target;
            ++index, current = current.next
        );

        if(index >= thisRef.size)
        {
            index = -1;
        }

        return index;
    }

    return {
        ListQueue : ListQueue
    };
})();
