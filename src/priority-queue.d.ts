import { Comparer } from "./comparer";

export declare class PriorityQueue<T>
{
    public constructor(
        comparer : Comparer<T>,
        allowDuplicates? : boolean
    );

    public getElementCount() : number;

    public isEmpty() : boolean;

    public isFull() : boolean;

    public peek() : T;

    public enqueue(
        e : T
    ) : this;

    public dequeue() : T;

    public clear() : void;
}
