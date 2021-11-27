export declare class Fail<E>{ #e: E };
export type Test<Ok extends "ok"> = Ok;


export type Eq<A, B> =
    A extends B
    ? B extends A
        ? "ok"
        : Fail<[B, "should be a subtype of", A]>
    : Fail<[A, "should be a subtype of", B]>;


export type True<A> = Eq<A, true>;
export type False<A> = Eq<A, false>;


type TestSuiteOk = "ok" | {[K in string]: TestSuiteOk};

type IsNotOk<K, V> = V extends "ok" ? never : K;

type ExtractFailing<Rec> =
    Rec extends Record<string, unknown>
    ? {
        [K in keyof Rec as IsNotOk<K, Rec[K]>]:
            K extends string ? ExtractFailing<Rec[K]> : never
    }
    : Rec extends Fail<infer S>
        ? S
        : Rec extends never
            ? "never"
            : Rec


export type Nested<R extends Record<string, unknown>> =
    R extends TestSuiteOk
    ? "ok"
    : ExtractFailing<R>;



type _test = {
    ExtractFailing: {
        empty: Test<Eq<ExtractFailing<{}>, {}>>,

        single_ok: Test<Eq<
            ExtractFailing<{foo: "ok"}>,
            {}
        >>,

        single_error: Test<Eq<
            ExtractFailing<{foo: "error"}>,
            {foo: "error"}
        >>,

        error_and_ok: Test<Eq<
            ExtractFailing<{foo: "error", bar: "ok"}>,
            {foo: "error"}
        >>,

        complex: Test<Eq<
            ExtractFailing<{foo: "error", bar: "ok", baz: ["error2"], fizz: "ok", buzz: "ok"}>,
            {foo: "error", baz: ["error2"]}
        >>,

        fromFail: Test<Eq<
            ExtractFailing<{foo: {bar: Fail<"oops">}, baz: 42, fizz: "ok"}>,
            {foo: {bar: "oops"}, baz: 42}
        >>,
    }
};
