const { expect } = require("chai");

const { forAwaitOf } = require("../../src");
const { waitFor } = require("../utils.test");

module.exports = function ()
{
    it("should iterate over an array.", async function ()
    {
        this.timeout(0);

        const arr = [1, "foo", false, { foo : 3 }, (a, b) => (a + b), 4.5, Symbol("foo")];

        await _iterate(arr);
    });

    it("should iterate over the argument object.", async function ()
    {
        this.timeout(0);

        await (async function ()
        {
            await _iterate(arguments);
        })(1, "foo", false, { foo : 3 }, (a, b) => (a + b), 4.5, Symbol("foo"));
    });

    it("should iterate over an instance of Set class.", async function ()
    {
        this.timeout(0);

        const set = new Set([1, "foo", false, { foo : 3 }, (a, b) => (a + b), 4.5, Symbol("foo")]);

        await _iterate(set);
    });

    it("should iterate over an instance of Map class.", async function ()
    {
        this.timeout(0);

        const map = new Map([["foo", 3], [false, 4], [2, "bar"], [Symbol("foo"), (a, b) => (a + b)]]);

        await _iterate(map);
    });

    it("should iterate over an async generator.", async function ()
    {
        this.timeout(0);

        async function* gen()
        {
            yield 1;
            yield 2;
            yield 3;
        }

        await _iterateAsyncGenerator(gen);
    });

    it("should iterate over a custom async iterable object.", async function ()
    {
        this.timeout(0);

        const asyncIterable = {};
        asyncIterable[Symbol.asyncIterator] = function ()
        {
            return {
                async next()
                {
                    await waitFor(25);

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

        await _iterate(asyncIterable);
    });

    it("should stop iterating when the callback function returns a truthy value.", async function ()
    {
        this.timeout(0);

        const arr = [1, "foo", false, { foo : 3 }, (a, b) => (a + b), 4.5, Symbol("foo")];

        const resultOfNativeForOf = [];
        for await (let item of arr)
        {
            if("function" === typeof item)
            {
                break;
            }

            resultOfNativeForOf.push(item);
        }

        const resultOfForOfFunction = [];
        await forAwaitOf(arr, /** @this {typeof resultOfForOfFunction} */async function (item)
        {
            let shouldContinue = true;

            if("function" === typeof item)
            {
                shouldContinue = false;
            }
            else
            {
                await waitFor(25);
                this.push(item);
            }

            return shouldContinue;
        }, resultOfForOfFunction);
    });

    it("should use specified key for finding a function that returns an async iterator.", async function ()
    {
        this.timeout(0);

        const customKeyName = "foo";
        const iterable = {};
        iterable[Symbol.asyncIterator] = function ()
        {
            return {
                async next()
                {
                    await waitFor(25);

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
                async next()
                {
                    await waitFor(25);

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
        await forAwaitOf(iterable, /** @this {typeof result} */async function (item)
        {
            await waitFor(25);
            this.push(item);
        }, result, customKeyName);

        expect(result).to.deep.equal([0, 1, 2]);
    });

    /**
     *  @template T
     *  @param {AsyncIterable<T>} asyncIterable
     *  @param {string | number | symbol} [iterableKey]
     */
    async function _iterate(asyncIterable)
    {
        /** @type {T[]} */const resultOfNativeForOf = [];
        for await (let item of asyncIterable)
        {
            await waitFor(25);
            resultOfNativeForOf.push(item);
        }

        /** @type {T[]} */const resultOfForOfFunction = [];
        await forAwaitOf(asyncIterable, /** @this {typeof resultOfForOfFunction} */async function (item)
        {
            await waitFor(25);
            this.push(item);
        }, resultOfForOfFunction);

        expect(resultOfForOfFunction).to.deep.equal(resultOfNativeForOf);
    }

    /**
     *  @template T
     *  @param {(...args : any[]) => AsyncGenerator<T>} asyncGenerator
     */
    async function _iterateAsyncGenerator(asyncGenerator)
    {
        /** @type {T[]} */const resultOfNativeForOf = [];
        for await (let item of asyncGenerator())
        {
            await waitFor(25);
            resultOfNativeForOf.push(item);
        }

        /** @type {T[]} */const resultOfForOfFunction = [];
        await forAwaitOf(asyncGenerator(), /** @this {typeof resultOfForOfFunction} */async function (item)
        {
            await waitFor(25);
            this.push(item);
        }, resultOfForOfFunction);

        expect(resultOfForOfFunction).to.deep.equal(resultOfNativeForOf);
    }
};
