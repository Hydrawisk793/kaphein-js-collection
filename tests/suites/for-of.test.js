const { expect } = require("chai");

const { forOf } = require("../../src");

module.exports = function ()
{
    it("should iterate over an array.", function ()
    {
        const arr = [1, "foo", false, { foo : 3 }, (a, b) => (a + b), 4.5, Symbol("foo")];

        _iterate(arr);
    });

    it("should iterate over an instance of Set class.", function ()
    {
        const set = new Set([1, "foo", false, { foo : 3 }, (a, b) => (a + b), 4.5, Symbol("foo")]);

        _iterate(set);
    });

    it("should iterate over an instance of Map class.", function ()
    {
        const map = new Map([["foo", 3], [false, 4], [2, "bar"], [Symbol("foo"), (a, b) => (a + b)]]);

        _iterate(map);
    });

    it("should iterate over a generator.", function ()
    {
        function* gen()
        {
            yield 1;
            yield 2;
            yield 3;
        }

        _iterateGenerator(gen);
    });

    it("should iterate over a custom iterable object.", function ()
    {
        const iterable = {};
        iterable[Symbol.iterator] = function ()
        {
            return {
                next : function next()
                {
                    return (
                        this._count < 5
                            ? {
                                value : this._count++,
                                done : false,
                            }
                            : {
                                done : true
                            }
                    );
                },
                _count : 0
            };
        };

        _iterate(iterable);
    });

    it("should stop iterating when the callback function returns a truthy value.", function ()
    {
        const arr = [1, "foo", false, { foo : 3 }, (a, b) => (a + b), 4.5, Symbol("foo")];

        const resultOfNativeForOf = [];
        for(let item of arr)
        {
            if("function" === typeof item)
            {
                break;
            }

            resultOfNativeForOf.push(item);
        }

        const resultOfForOfFunction = [];
        forOf(arr, function (item)
        {
            let shouldContinue = true;

            if("function" === typeof item)
            {
                shouldContinue = false;
            }
            else
            {
                this.push(item);
            }

            return shouldContinue;
        }, resultOfForOfFunction);
    });

    it("should use specified key for finding a function that returns an iterator.", function ()
    {
        const customKeyName = "foo";
        const iterable = {};
        iterable[Symbol.iterator] = function ()
        {
            return {
                next : function next()
                {
                    return (
                        this._count < 5
                            ? {
                                value : this._count++,
                                done : false,
                            }
                            : {
                                done : true
                            }
                    );
                },
                _count : 0
            };
        };
        iterable[customKeyName] = function ()
        {
            return {
                next : function next()
                {
                    return (
                        this._count < 3
                            ? {
                                value : this._count++,
                                done : false,
                            }
                            : {
                                done : true
                            }
                    );
                },
                _count : 0
            };
        };

        const result = [];
        forOf(iterable, function (item)
        {
            this.push(item);
        }, result, customKeyName);

        expect(result).to.deep.equal([0, 1, 2]);
    });

    /**
     *  @template T
     *  @param {Iterable<T>} iterable
     *  @param {string | number | symbol} [iterableKey]
     */
    function _iterate(iterable)
    {
        /** @type {T[]} */const resultOfNativeForOf = [];
        for(let item of iterable)
        {
            resultOfNativeForOf.push(item);
        }

        /** @type {T[]} */const resultOfForOfFunction = [];
        forOf(iterable, function (item)
        {
            this.push(item);
        }, resultOfForOfFunction);

        expect(resultOfForOfFunction).to.deep.equal(resultOfNativeForOf);
    }

    /**
     *  @template T
     *  @param {(...args : any[]) => Generator<T>} generator
     */
    function _iterateGenerator(generator)
    {
        /** @type {T[]} */const resultOfNativeForOf = [];
        for(let item of generator())
        {
            resultOfNativeForOf.push(item);
        }

        /** @type {T[]} */const resultOfForOfFunction = [];
        forOf(generator(), function (item)
        {
            this.push(item);
        }, resultOfForOfFunction);

        expect(resultOfForOfFunction).to.deep.equal(resultOfNativeForOf);
    }
};
