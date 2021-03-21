export declare function flatten<
    A,
    D extends number = 999e308
>(
    v : A,
    depth? : D
) : FlattenArray<A, D>[];

export declare type FlattenArray<
    A,
    D extends number
> = {
    0: A,
    1: A extends Array<infer Inner>
        ? FlattenArray<Inner, [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D extends 999e308 ? 20 : D]>
        : A
}[D extends -1 ? 0 : 1];
