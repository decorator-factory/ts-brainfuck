import { Add, N0, N1, N2, N3, N5, N6, N9, Nat, Pred, Suc, SucAdd, Z } from "./nat";
import { Eq, Nested, Test } from "./test";

type _TupleToRec<
    Tup extends unknown[],
    Acc extends Record<string, unknown>,
    Idx extends Nat,
> =  //-> Record<Nat, unknown>
    Tup extends [infer X, ...infer Xs]
    ? _TupleToRec<Xs, Acc & Record<Idx, X>, Suc<Idx>>
    : Acc;
export type TupleToRec<Tup extends unknown[]> = //-> Record<Nat, unknown>
    _TupleToRec<Tup, {}, Z>


type _TupleLen<Tup extends unknown[], Acc extends Nat> =
    Tup extends [any, ...infer Xs]
    ?  _TupleLen<Xs, Suc<Acc>>
    : Acc;
type TupleLen<Tup extends unknown[]> =
    _TupleLen<Tup, Z>;


type TracedAcc<Acc extends unknown[], S extends string> =
    [s: S, acc: Acc]
type AnyTrAcc = TracedAcc<unknown[], string>;


export type Op =
    | { tag: "+" }
    | { tag: "-" }
    | { tag: ">" }
    | { tag: "<" }
    | { tag: "." }
    | { tag: "," }
    | { tag: "[", gotoIfZero: Nat }
    | { tag: "]", goto: Nat }
    | { tag: "halt" }


type _Parse<S extends string, Iptr extends Nat, Start extends Nat, Acc extends AnyTrAcc> =
    S extends `${infer Char}${infer Rest}`
    ? Char extends '+'|'-'|'<'|'>'|'.'|','
        ? _Parse<Rest, Suc<Iptr>, Start, [Rest, [...Acc[1], {tag: Char}]]>
        : Char extends '['
            ? _Parse<Rest, Suc<Iptr>, Suc<Iptr>, [Rest, []]> extends infer SubAcc
                ? SubAcc extends AnyTrAcc
                    ? _Parse<SubAcc[0], Suc<Iptr>, Start, [
                        SubAcc[0],
                        [
                            ...Acc[1],
                            {tag: '[', gotoIfZero: SucAdd<Iptr, TupleLen<SubAcc[1]>>},
                            ...SubAcc[1],
                        ]
                    ]>
                    : never
                : never
            : Char extends ']'
                ? [Rest, [...Acc[1], {tag: ']', goto: Pred<Start>}]]

                : _Parse<Rest, Iptr, Start, Acc>  // ignore characters that aren't +-<>[].,
    : Acc
export type Parse<S extends string> =
    [..._Parse<S, Z, Z, [S, []]>[1], {tag: "halt"}];




type _test = Test<Nested<{
    TupleToRec: Nested<{
        empty: Eq<
            TupleToRec<[]>,
            {}
        >,

        singleton: Eq<
            TupleToRec<[42]>,
            Record<N0, 42>
        >,

        two: Eq<
            TupleToRec<[5, 7]>,
            Record<N0, 5> & Record<N1, 7>
        >,

        three: Eq<
            TupleToRec<[5, 7, 0]>,
            Record<N0, 5> & Record<N1, 7> & Record<N2, 0>
        >,
    }>,

    Parse: Nested<{
        empty: Eq<
            Parse<"">,
            [{tag: "halt"}]
        >,

        trivial: Eq<
            Parse<"++->>.,">,
            [{tag: "+"}, {tag: "+"}, {tag: "-"}, {tag: ">"}, {tag: ">"}, {tag: "."}, {tag: ","}, {tag: "halt"}]
        >,

        single_nested: Eq<
            Parse<"++[-]>">,
            [{tag: "+"}, {tag: "+"}, {tag: "[", gotoIfZero: N5}, {tag: "-"}, {tag: "]", goto: N2}, {tag: ">"}, {tag: "halt"}]
        >,

        add_2_to_5: Eq<
            Parse<"++>+++[-<+>]<.">,
            [{tag: "+"}, {tag: "+"},
             {tag: ">"},
             {tag: "+"}, {tag: "+"}, {tag: "+"},
             {tag: "[", gotoIfZero: Add<N9, N3>},
                {tag: "-"}, {tag: "<"}, {tag: "+"}, {tag: ">"},
             {tag: "]", goto: N6},
             {tag: "<"}, {tag: "."},
             {tag: "halt"}
            ]
        >,

    }>
}>>;
