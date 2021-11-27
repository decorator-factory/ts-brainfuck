import { Eq, False, Nested, Test, True } from "./test";

// HACK: we make naturals into strings so that
// they can be used as keys
export type Z = "Z";
export type Suc<N extends Nat> = `${N}+`;
export type Nat = Suc<any> | Z;


export type N0 = Z;
export type N1 = Suc<N0>;
export type N2 = Suc<N1>;
export type N3 = Suc<N2>;
export type N4 = Suc<N3>;
export type N5 = Suc<N4>;
export type N6 = Suc<N5>;
export type N7 = Suc<N6>;
export type N8 = Suc<N7>;
export type N9 = Suc<N8>;


type _FromUnary<S extends string, Acc extends Nat> =
    S extends `1${infer Rest}`
    ? _FromUnary<Rest, Suc<Acc>>
    : S extends ""
        ? Acc
        : {_expected: [`1${string}`, ''], _found: S}
export type FromUnary<S extends string> =
    _FromUnary<S, Z>;


type _ToUnary<N extends Nat, Acc extends string> =
    N extends Suc<infer M>
    ? _ToUnary<M, `${Acc}1`>
    : Acc;
export type ToUnary<N extends Nat> =
    _ToUnary<N, "">;


export type ToUnary0<N extends Nat> =
    _ToUnary<N, ""> extends ""
    ? "0"
    : _ToUnary<N, "">;


export type Add<A extends Nat, B extends Nat> =
    A extends Suc<infer PredA>
    ? Add<PredA, Suc<B>>
    : B;


export type SucAdd<A extends Nat, B extends Nat> =
    A extends Suc<infer PredA>
    ? SucAdd<PredA, Suc<B>>
    : Suc<B>;


export type Pred<N extends Nat> =
    N extends Suc<infer M>
    ? M
    : never;


type IsPrefixedBy<S extends string, Prefix extends string> =
    S extends `${Prefix}${string}` ? true : false


export type Ge<A extends Nat, B extends Nat> =
    IsPrefixedBy<B, A>;


type _test = Test<Nested<{
    FromUnary: Nested<{
        zero: Eq<FromUnary<"">, Z>,
        one: Eq<FromUnary<"1">, Suc<Z>>,
        three: Eq<FromUnary<"111">, Suc<Suc<Suc<Z>>>>,
    }>,

    Add: Nested<{
        ["0 + 0"]: Eq<Add<Z, Z>, Z>,
        ["3 + 2"]: Eq<Add<N3, N2>, N5>,
        ["1 + 7"]: Eq<Add<N2, N6>, N8>,
        ["7 + 2"]: Eq<Add<N7, N2>, N9>,
    }>,

    SucAdd: Nested<{
        ["0 +' 0"]: Eq<SucAdd<N0, N0>,   N1>,
        ["3 +' 2"]: Eq<SucAdd<N3, N2>, N6>,
        ["1 +' 7"]: Eq<SucAdd<N2, N6>, N9>,
        ["7 +' 2"]: Eq<SucAdd<N7, N1>, N9>,
    }>,

    Pred: Nested<{
        zero: Eq<Pred<Z>, never>,
        one: Eq<Pred<Suc<Z>>, Z>,
        four: Eq<Pred<N4>, N3>,
    }>,

    GE: Nested<{
        ["0 <= 0"]: True<Ge<N0, N0>>,
        ["0 <= 1"]: True<Ge<N0, N1>>,
        ["0 <= 2"]: True<Ge<N0, N2>>,
        ["0 <= 3"]: True<Ge<N0, N3>>,
        ["1 <= 1"]: True<Ge<N1, N1>>,
        ["1 <= 2"]: True<Ge<N1, N2>>,
        ["1 <= 3"]: True<Ge<N1, N3>>,
        ["2 <= 2"]: True<Ge<N2, N2>>,
        ["2 <= 3"]: True<Ge<N2, N3>>,
        ["3 <= 3"]: True<Ge<N3, N3>>,
        ["1 > 0 "]: False<Ge<N1, N0>>,
        ["2 > 0 "]: False<Ge<N2, N0>>,
        ["2 > 1 "]: False<Ge<N2, N1>>,
        ["3 > 0 "]: False<Ge<N3, N0>>,
        ["3 > 1 "]: False<Ge<N3, N1>>,
        ["3 > 2 "]: False<Ge<N3, N2>>,
    }>
}>>;