const { expect } = require("chai");

const { ListQueue } = require("../../src");

module.exports = function ()
{
    describe("constructor", function ()
    {
        it("default", function ()
        {
            expect(() => new ListQueue()).to.not.throw();
        });

        it("array", function ()
        {
            expect(() => new ListQueue([1, 2, 3])).to.not.throw();
        });

        it("copy constructor", function ()
        {
            const arr = [1, 2, 3];
            const a = new ListQueue(arr);
            const b = new ListQueue(a);

            expect(Array.from(a)).deep.equal(Array.from(b)).deep.equal(arr);
        });
    });

    describe("size", function ()
    {
        const arr = [1, 2, 3];
        const q = new ListQueue(arr);

        it("basic", function ()
        {
            expect(q.size).to.equal(arr.length);
            expect(q.isEmpty()).to.equal(false);
        });

        it("after enqueue a element", function ()
        {
            q.enqueue(4);

            expect(q.size).to.equal(arr.length + 1);
            expect(q.isEmpty()).to.equal(false);
        });

        it("after dequeue twice", function ()
        {
            q.dequeue();
            q.dequeue();

            expect(q.size).to.equal(arr.length - 1);
            expect(q.isEmpty()).to.equal(false);
        });

        it("after empty the queue", function ()
        {
            q.dequeue();
            q.dequeue();

            expect(q.size).to.equal(0);
            expect(q.isEmpty()).to.equal(true);
        });
    });
};
