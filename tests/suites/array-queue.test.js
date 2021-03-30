const { expect } = require("chai");

const { ArrayQueue } = require("../../src");
const {
    nextInteger,
    nextIntegers,
} = require("../utils.test");
const queueCommon = require("./queue-common.test");

module.exports = function ()
{
    (queueCommon.bind(this))(
        ArrayQueue,
        [],
        nextIntegers(nextInteger(3, 10), -10, 10),
        "ArrayQueue"
    );

    describe("attach", function ()
    {
        it("should attach an existing array.", function ()
        {
            const samples = [1, 2, 3];
            const q = new ArrayQueue();
            q.attach(samples);

            expect(q.size).to.equal(samples.length);
            expect(Array.from(q)).to.deep.equal(samples);
        });

        it("should change the attached array.", function ()
        {
            const samples = [1, 2, 3];
            const changedSamples = samples.slice();
            changedSamples.splice(0, 1);

            const q = new ArrayQueue();
            q.attach(samples);
            q.dequeue();

            expect(q.size).to.equal(changedSamples.length);
            expect(Array.from(q)).to.deep.equal(changedSamples);
        });
    });

    describe("detach", function ()
    {
        it("should detach the internal array.", function ()
        {
            const samples = [1, 2, 3];
            const q = new ArrayQueue(samples);
            const arr = q.detach();

            expect(q.size).to.equal(0);
            expect(arr).to.deep.equal(samples);
        });

        it("should return the exact same array that was attached before.", function ()
        {
            const samples = [1, 2, 3];
            const q = new ArrayQueue();
            q.attach(samples);
            const detached = q.detach();

            expect(samples).to.equal(detached);
        });
    });

    describe("static wrap", function ()
    {
        it("should wrap an existing array.", function ()
        {
            const samples = [1, 2, 3];
            const q = ArrayQueue.wrap(samples);

            expect(q.size).to.equal(samples.length);
        });
    });
};
