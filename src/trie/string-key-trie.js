var kapheinJsTypeTrait = require("kaphein-js-type-trait");
var isUndefined = kapheinJsTypeTrait.isUndefined;
var isIterable = kapheinJsTypeTrait.isIterable;
var isFunction = kapheinJsTypeTrait.isFunction;

var _mapToJSON = require("../to-json-impl")._mapToJSON;
var forOf = require("../for-of").forOf;
var RbTreeMap = require("../rb-tree").RbTreeMap;
var StringKeyMap = require("../record-wrapper").StringKeyMap;
var isSymbolSupported = require("../is-symbol-supported").isSymbolSupported;

module.exports = (function ()
{
    var _isSymbolSupported = isSymbolSupported();

    /**
     *  @template V
     *  @constructor
     *  @param {Iterable<[string, V]>} iterable
     */
    function StringKeyTrie()
    {
        /** @type {Node<V>} */this._root = null;
        this.size = 0;

        /** @type {Iterable<[string, V]>} */var iterable = arguments[0];
        if(isIterable(iterable))
        {
            forOf(
                iterable,
                /**
                 *  @this {StringKeyTrie<V>}
                 */
                function (pair)
                {
                    this.set(pair[0], pair[1]);
                },
                this
            );
        }
    }

    StringKeyTrie.prototype = {
        constructor : StringKeyTrie,

        entries : function entries()
        {
            return new Iterator(this._root, 0);
        },

        keys : function keys()
        {
            return new Iterator(this._root, 1);
        },

        values : function values()
        {
            return new Iterator(this._root, 2);
        },

        forEach : function forEach(callback)
        {
            if(!isFunction(callback))
            {
                throw new TypeError("'callback' must be a function.");
            }
            var thisArg = arguments[1];

            forOf(this, function (pair)
            {
                callback.call(thisArg, pair[1], pair[0], this);
            }, this);
        },

        map : function map(callback)
        {
            if(!isFunction(callback))
            {
                throw new TypeError("'callback' must be a function.");
            }
            var thisArg = arguments[1];

            var results = [];
            forOf(this, function (pair)
            {
                results.push(callback.call(thisArg, pair[1], pair[0], this));
            }, this);

            return results;
        },

        /**
         *  @param {string} key
         */
        has : function has(key)
        {
            var node = _find(this._root, key);

            return node && node.hasElement();
        },

        /**
         *  @param {string} key
         */
        hasPrefix : function hasPrefix(key)
        {
            var node = _find(this._root, key);

            return !!node;
        },

        /**
         *  @param {string} key
         */
        get : function get(key)
        {
            var node = _find(this._root, key);

            return (node ? node.getElement() : void 0);
        },

        /**
         *  @param {string} key
         */
        getPrefixMap : function getPrefixMap(key)
        {
            var prefixNode = _find(this._root, key, false);

            var result = {};
            _traverseByPreOrder(prefixNode, function (node)
            {
                if(node.hasElement())
                {
                    result[node.getPath()] = node.getElement();
                }
            });

            return StringKeyMap.wrap(result);
        },

        /**
         *  @param {string} key
         *  @param {V} value
         */
        set : function set(key, value)
        {
            var current = this._root;
            if(!current)
            {
                current = new Node();
                this._root = current;
            }
            for(var i = 0; i < key.length; ++i)
            {
                var c = key[i];
                if(!current._children.has(c))
                {
                    var newChild = new Node();
                    newChild.parent = current;
                    newChild._label = c;
                    current._children.set(c, newChild);
                }

                current = current._children.get(c);
            }

            var nextSize = this.size + (current.hasElement() ? 0 : 1);
            current.setElement(value);
            this.size = nextSize;

            return this;
        },

        /**
         *  @param {string} key
         */
        "delete" : function (key)
        {
            return this.del(key);
        },

        /**
         *  @param {string} key
         */
        del : function del(key)
        {
            var node = _find(this._root, key);
            var result = node && node.hasElement();
            if(result)
            {
                node.setElement(void 0);
                --this.size;

                while(node && node.isLeaf() && !node.hasElement())
                {
                    var parent = node.parent;
                    if(parent)
                    {
                        parent._children["delete"](node._label);
                    }
                    else
                    {
                        this._root = null;
                    }

                    node = parent;
                }
            }

            return result;
        },

        clear : function clear()
        {
            this._root = null;
            this.size = 0;
        },

        toJSON : function toJSON()
        {
            return _mapToJSON(this);
        }
    };

    if(_isSymbolSupported)
    {
        /**
         *  @returns {PairIterator<V>}
         */
        StringKeyTrie.prototype[Symbol.iterator] = function ()
        {
            return new Iterator(this._root, 0);
        };

        StringKeyTrie.prototype[Symbol.toStringTag] = "StringKeyTrie";
    }

    /**
     *  @template V
     *  @constructor
     *  @param {Node<V>} [node]
     *  @param {number} [valueType]
     */
    function Iterator()
    {
        /** @type {Node<V>[]} */this._nodeStack = [(arguments[0] || null)];
        var valueType = arguments[1];
        this._valueType = (
            Number.isSafeInteger(valueType) && valueType >= 0 && valueType <= 2
                ? valueType
                : 0
        );
    }

    Iterator.prototype = {
        constructor : Iterator,

        /**
         *  @returns {IteratorReturnResult<[string, V]>}
         */
        next : function next()
        {
            var result = {
                done : true
            };

            /** @type {Node<V | null} */var node = null;
            for(var shouldContinue = true; shouldContinue && this._nodeStack.length > 0; )
            {
                node = this._nodeStack.pop();
                if(node)
                {
                    shouldContinue = !node.hasElement();

                    if(!node.isLeaf())
                    {
                        var childNodes = Array.from(node._children.values());
                        for(var j = childNodes.length, i = 0; i < childNodes.length; ++i)
                        {
                            --j;
                            this._nodeStack.push(childNodes[j]);
                        }
                    }
                }
                else
                {
                    result.done = true;
                    shouldContinue = false;
                }
            }

            if(node)
            {
                result.done = false;
                switch(this._valueType)
                {
                case 1:
                    result.value = node.getPath();
                    break;
                case 2:
                    result.value = node.getElement();
                    break;
                default:
                    result.value = [node.getPath(), node.getElement()];
                }
            }

            return result;
        }
    };

    if(_isSymbolSupported)
    {
        Iterator.prototype[Symbol.iterator] = function ()
        {
            return this;
        };
    }

    /**
     *  @template V
     *  @constructor
     */
    function Node()
    {
        /** @type {Node<V>} */this.parent = null;
        this._children = new RbTreeMap(
            /** @type {Iterable<[string, Node<V>]>} */(null),
            _stringComparer
        );
        /** @type {string} */this._label = null;
        this._hasElement = false;
        /** @type {V} */this._element = null;
    }

    Node.prototype = {
        constructor : Node,

        getPath : function getPath()
        {
            var path = "";
            for(var current = this; current && current.parent; current = current.parent)
            {
                path = current._label + path;
            }

            return path;
        },

        isLeaf : function isLeaf()
        {
            return this._children.size < 1;
        },

        hasElement : function hasElement()
        {
            return this._hasElement;
        },

        getElement : function getElement()
        {
            return (this._hasElement ? this._element : void 0);
        },

        /**
         *  @param {V | null | undefined} element
         */
        setElement : function setElement(element)
        {
            this._hasElement = !isUndefined(element);
            this._element = (this._hasElement ? element : null);
        }
    };

    /**
     *  @param {string} l
     *  @param {string} r
     */
    function _stringComparer(l, r)
    {
        return l.localeCompare(r);
    }

    /**
     *  @template V
     *  @param {Node<V>} root
     *  @param {(node : Node<V>) => boolean} callback
     *  @param {any} [thisArg]
     */
    function _traverseByPreOrder(root, callback)
    {
        var thisArg = arguments[2];

        /** @type {Node<V>[]} */var nodeStack = [];
        nodeStack.push(root);

        var shouldContinue = true;
        while(shouldContinue && nodeStack.length > 0)
        {
            var node = nodeStack.pop();
            if(node)
            {
                shouldContinue = !((0, callback).call(thisArg, node));

                if(shouldContinue)
                {
                    if(!node.isLeaf())
                    {
                        var childNodes = Array.from(node._children.values());
                        for(var j = childNodes.length, i = 0; i < childNodes.length; ++i)
                        {
                            --j;
                            nodeStack.push(childNodes[j]);
                        }
                    }
                }
            }
        }

        return shouldContinue;
    }

    /**
     *  @template V
     *  @param {Node<V>} node
     *  @param {string} key
     */
    function _find(node, key)
    {
        /** @type {Node<V>} */var current = node;
        var found = !!current;
        for(var i = 0; current && found && i < key.length; ++i)
        {
            var c = key[i];
            if(current._children.has(c))
            {
                current = current._children.get(c);
            }
            else
            {
                found = false;
            }
        }

        return (found ? current : null);
    }

    return {
        StringKeyTrie : StringKeyTrie
    };
})();
