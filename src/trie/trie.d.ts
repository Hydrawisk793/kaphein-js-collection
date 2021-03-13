export declare interface Trie<K, V> extends Map<K, V>
{
    hasPrefix(
        key : K
    ) : boolean;

    getPrefixMap(
        key : K
    ) : Map<K, V>;
}
