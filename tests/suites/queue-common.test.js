const { expect } = require("chai");

module.exports = (
    /**
     *  @template T
     *  @template {import("../../src").Queue<T>} QueueType
     *  @param {new (...args : any[]) => QueueType} ctor
     *  @param {any[]} ctorArgs
     *  @param {T[]} sampleArr
     *  @param {string} toStringTag
     */
    function (ctor, ctorArgs, sampleArr, toStringTag)
    {
        describe("constructor", function ()
        {
            it("should be empty on default.", function ()
            {
                /** @type {QueueType} */const q = Reflect.construct(ctor, [null, ...ctorArgs]);
                expect(q.size).to.equal(0);
            });

            it("should enqueue elements of the other.", function ()
            {
                /** @type {QueueType} */const q1 = Reflect.construct(ctor, [sampleArr, ...ctorArgs]);
                /** @type {QueueType} */const q2 = Reflect.construct(ctor, [q1]);
                expect(q1.size).to.equal(q2.size).and.to.equal(sampleArr.length);
            });

            it("should enqueue values from an iterable object.", function ()
            {
                /** @type {QueueType} */const q = Reflect.construct(ctor, [sampleArr, ...ctorArgs]);
                expect(q.size).to.equal(sampleArr.length);
            });
        });

        describe("peek", function ()
        {
            it("should return the first value.", function ()
            {
                /** @type {QueueType} */const q1 = Reflect.construct(ctor, [sampleArr, ...ctorArgs]);
                const q1Size = q1.size;

                expect(q1.peek()).to.deep.equal(sampleArr[0]);
                expect(q1.size).to.deep.equal(q1Size);

                /** @type {QueueType} */const q2 = Reflect.construct(ctor, [null, ...ctorArgs]);
                expect(q2.peek()).to.be.undefined;
            });
        });

        describe("enqueue", function ()
        {
            it("should enqueue values.", function ()
            {
                /** @type {QueueType} */const q = Reflect.construct(ctor, [null, ...ctorArgs]);
                for(let i = 0; i < sampleArr.length; ++i)
                {
                    q.enqueue(sampleArr[i]);
                    expect(q.size).to.equal(i + 1);
                }
            });
        });

        describe("dequeue", function ()
        {
            it("should enqueue values.", function ()
            {
                /** @type {QueueType} */const q = Reflect.construct(ctor, [sampleArr, ...ctorArgs]);
                const elems = [];
                while(!q.isEmpty())
                {
                    elems.push(q.dequeue());
                }

                expect(q.isEmpty()).to.equal(true);
                expect(q.size).to.equal(0);
                expect(elems).to.deep.equal(sampleArr);
                expect(q.dequeue()).to.be.undefined;
            });
        });

        describe("flush", function ()
        {
            it("should dequeue and return all values.", function ()
            {
                /** @type {QueueType} */const q = Reflect.construct(ctor, [sampleArr, ...ctorArgs]);
                const elems = q.flush();

                expect(elems).to.deep.equal(sampleArr);
                expect(q.size).to.equal(0);
            });
        });

        describe("clear", function ()
        {
            it("should delete all values.", function ()
            {
                /** @type {QueueType} */const q = Reflect.construct(ctor, [sampleArr, ...ctorArgs]);
                q.clear();
                expect(q.size).to.equal(0);
                expect(q.isEmpty()).to.equal(true);
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
