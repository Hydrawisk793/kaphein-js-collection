const { expect } = require("chai");

module.exports = (
    /**
     *  @template T
     *  @template {Set<T>} SetType
     *  @param {new (...args : any[]) => SetType} ctor
     *  @param {any[]} ctorArgs
     *  @param {(l : T, r : T) => number} comparer
     *  @param {T[]} elements
     *  @param {string} toStringTag
     */
    function (ctor, ctorArgs, comparer, elements, toStringTag)
    {
        describe("constructor", function ()
        {
            it("should be empty on default.", function ()
            {
                /** @type {SetType} */const set = Reflect.construct(ctor, [null, ...ctorArgs]);
                expect(set.size).to.equal(0);
            });

            it("should add pairs from an iterable object.", function ()
            {
                /** @type {SetType} */const set1 = Reflect.construct(ctor, [elements, ...ctorArgs]);
                /** @type {SetType} */const set2 = Reflect.construct(ctor, [null, ...ctorArgs]);
                elements.forEach(function (element)
                {
                    set2.add(element);
                });

                expect(set1.size).to.equal(elements.length);
                expect(set2.size).to.equal(set1.size);
            });
        });

        describe("forEach", function ()
        {
            it("should iterate values.", function ()
            {
                /** @type {SetType} */const set = Reflect.construct(ctor, [elements, ...ctorArgs]);
                /** @type {T[]} */const values = [];
                set.forEach(function (value)
                {
                    values.push(value);
                });
                expect(values.sort(comparer)).to.deep.equal(elements.sort(comparer));
            });
        });

        describe("Symbol.iterator", function ()
        {
            it("should iterate values.", function ()
            {
                /** @type {SetType} */const set = Reflect.construct(ctor, [elements, ...ctorArgs]);
                /** @type {T[]} */const values = [];
                for(const value of set)
                {
                    values.push(value);
                }
                expect(values.sort(comparer)).to.deep.equal(elements.sort(comparer));
            });
        });

        describe("entries", function ()
        {
            it("should iterate value-value pairs.", function ()
            {
                /** @type {SetType} */const set = Reflect.construct(ctor, [elements, ...ctorArgs]);
                /** @type {[T, T][]} */const pairs = [];
                for(const pair of set.entries())
                {
                    pairs.push(pair);
                }
                expect(pairs.map((p) => (p[1])).sort(comparer)).to.deep.equal(elements.sort(comparer));
            });
        });

        describe("keys", function ()
        {
            it("should iterate values.", function ()
            {
                /** @type {SetType} */const set = Reflect.construct(ctor, [elements, ...ctorArgs]);
                /** @type {T[]} */const keys = [];
                for(const key of set.keys())
                {
                    keys.push(key);
                }
                expect(keys.sort(comparer)).to.deep.equal(elements.sort(comparer));
            });
        });

        describe("values", function ()
        {
            it("should iterate values.", function ()
            {
                /** @type {SetType} */const set = Reflect.construct(ctor, [elements, ...ctorArgs]);
                /** @type {T[]} */const values = [];
                for(const value of set.values())
                {
                    values.push(value);
                }
                expect(values.sort(comparer)).to.deep.equal(elements.sort(comparer));
            });
        });

        describe("clear", function ()
        {
            it("should delete all elements.", function ()
            {
                /** @type {SetType} */const set = Reflect.construct(ctor, [elements, ...ctorArgs]);
                set.clear();
                expect(set.size).to.equal(0);
                expect(Array.from(set.values())).to.deep.equal([]);
            });
        });

        describe("Symbol.toStringTag", function ()
        {
            it(`should return '${ toStringTag }'.`, function ()
            {
                expect((Reflect.construct(ctor, [null, ...ctorArgs]))[Symbol.toStringTag]).to.equal(toStringTag);
            });

            it(`should make the return value of 'Object.prototype.toString' '[object ${ toStringTag }]'.`, function ()
            {
                expect(Object.prototype.toString.call(Reflect.construct(ctor, [null, ...ctorArgs]))).to.equal(`[object ${ toStringTag }]`);
            });
        });
    }
);
