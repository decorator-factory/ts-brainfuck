import { Ge, Nat, Suc, ToUnary0, Z } from "./nat";
import { N0, N1, N2, N3, N4, N5, N7, N8 } from "./nat";
import { Eq, Nested, Test } from "./test";



type RemoveKeysLessThan<Mem extends Record<Nat, Nat>, Remove extends Nat> = {
    [K in keyof Mem as
        Ge<Remove, Nat & K> extends true ? K : never
    ]: Mem[K]
}


type _MaxAdr<Mem extends Record<Nat, Nat>, Counter extends Nat> = //-> Nat
    {} extends RemoveKeysLessThan<Mem, Counter>
    ? Counter
    : _MaxAdr<Mem, Suc<Counter>>;
export type MaxAdr<Mem extends Record<string, Nat>> = //-> Nat
    _MaxAdr<Mem, Z>;


type _MemSlice<
    Mem extends Record<string, Nat>,
    From extends Nat,
    To extends Nat,
    Acc extends [Nat, Nat][]
> =
    Ge<To, From> extends true
    ? Acc
    : From extends keyof Mem
        ? _MemSlice<Mem, Suc<From>, To, [...Acc, [From, Mem[From]]]>
        : _MemSlice<Mem, Suc<From>, To, [...Acc, [From, Z]]>;

export type MemSlice<
    Mem extends Record<string, Nat>,
    From extends Nat,
    To extends Nat,
> =
    _MemSlice<Mem, From, To, []>;

export type MemPairs<Mem extends Record<string, Nat>> =
    MemSlice<Mem, Z, MaxAdr<Mem>>


type _RemoveSpacesAndCommas<S extends string> =
    S extends ` ${infer Subs}`
    ? _RemoveSpacesAndCommas<Subs>
    : S extends `,${infer Subs}`
        ? _RemoveSpacesAndCommas<Subs>
        : S;

type _WrapListRepr<S extends string> =
    `(${_RemoveSpacesAndCommas<S>})`;

type _MemRepr<
    Pairs extends unknown[],
    Acc extends string,
    Ptr extends Nat = never,
> =
    Pairs extends [[infer Adr, infer Val], ...infer Rest]
    ? Adr extends string
        ? ToUnary0<Val & Nat> extends infer V
            ? Adr extends Ptr
                ? _MemRepr<Rest, `${Acc}, [${V & string}]`>
                // not forwarding Ptr here -------------------^
                // because we already found where our Ptr is!
                : _MemRepr<Rest, `${Acc}, ${V & string}`, Ptr>
            : never
        : never
    : Acc;

export type MemRepr<Mem extends Record<string, Nat>, Ptr extends Nat = never> =
    _WrapListRepr<_MemRepr<MemPairs<Mem>, "", Ptr>>


type _test = Test<Nested<{
    MaxAdr: Nested<{
        empty: Eq<MaxAdr<{}>, Z>,

        single: Eq<MaxAdr<Record<N4, N3>>, N5>,

        two_entries: Eq<
            MaxAdr<
                Record<N4, N3> & Record<N7, N2>
            >,
            N8
        >,

        four_entries: Eq<
            MaxAdr<
                Record<N0, N0>
                & Record<N7, N3>
                & Record<N5, N2>
                & Record<N1, N1>
            >,
            N8
        >,
    }>,
}>>