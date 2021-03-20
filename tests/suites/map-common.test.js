const { expect } = require("chai");

module.exports = (
    /**
     *  @template K, V
     *  @template {Map<K, V>} MapType
     *  @param {new (...args : any[]) => MapType} ctor
     *  @param {any[]} ctorArgs
     *  @param {(l : [K, V], r : [K, V]) => number} pairComparer
     *  @param {[K, V][]} pairs
     *  @param {string} toStringTag
     */
    function (ctor, ctorArgs, pairComparer, pairs, toStringTag)
    {
        describe("constructor", function ()
        {
            it("should be empty on default.", function ()
            {
                /** @type {MapType} */const map = Reflect.construct(ctor, [null, ...ctorArgs]);
                expect(map.size).to.equal(0);
            });

            it("should set key-value pairs from an iterable object.", function ()
            {
                /** @type {MapType} */const map1 = Reflect.construct(ctor, [pairs, ...ctorArgs]);
                /** @type {MapType} */const map2 = Reflect.construct(ctor, [null, ...ctorArgs]);
                pairs.forEach(function (pair)
                {
                    map2.set(pair[0], pair[1]);
                });

                expect(map1.size).to.equal(pairs.length);
                expect(map2.size).to.equal(map1.size);
            });
        });

        describe("forEach", function ()
        {
            it("should iterate key-value pairs.", function ()
            {
                /** @type {MapType} */const map = Reflect.construct(ctor, [pairs, ...ctorArgs]);
                /** @type {[K, V][]} */const pairArr = [];
                map.forEach(function (value, key)
                {
                    pairArr.push([key, value]);
                });
                expect(pairArr.sort(pairComparer)).to.deep.equal(pairs.sort(pairComparer));
            });
        });

        describe("Symbol.iterator", function ()
        {
            it("should iterate key-value pairs.", function ()
            {
                /** @type {MapType} */const map = Reflect.construct(ctor, [pairs, ...ctorArgs]);
                /** @type {[K, V][]} */const pairArr = [];
                for(const pair of map)
                {
                    pairArr.push(pair);
                }
                expect(pairArr.sort(pairComparer)).to.deep.equal(pairs.sort(pairComparer));
            });
        });

        describe("entries", function ()
        {
            it("should iterate key-value pairs.", function ()
            {
                /** @type {MapType} */const map = Reflect.construct(ctor, [pairs, ...ctorArgs]);
                /** @type {[K, V][]} */const pairArr = [];
                for(const pair of map.entries())
                {
                    pairArr.push(pair);
                }
                expect(pairArr.sort(pairComparer)).to.deep.equal(pairs.sort(pairComparer));
            });
        });

        describe("keys", function ()
        {
            it("should iterate keys.", function ()
            {
                /** @type {MapType} */const map = Reflect.construct(ctor, [pairs, ...ctorArgs]);
                /** @type {K[]} */const keys = [];
                for(const key of map.keys())
                {
                    keys.push(key);
                }
                expect(keys).to.include.deep.members(pairs.map((p) => p[0]));
            });
        });

        describe("values", function ()
        {
            it("should iterate values.", function ()
            {
                /** @type {MapType} */const map = Reflect.construct(ctor, [pairs, ...ctorArgs]);
                /** @type {V[]} */const values = [];
                for(const value of map.values())
                {
                    values.push(value);
                }
                expect(values).to.include.deep.members(pairs.map((p) => p[1]));
            });
        });

        describe("clear", function ()
        {
            it("should delete all elements.", function ()
            {
                /** @type {MapType} */const map = Reflect.construct(ctor, [pairs, ...ctorArgs]);
                map.clear();
                expect(map.size).to.equal(0);
                expect(Array.from(map.values())).to.deep.equal([]);
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
