import { MemRepr } from "./mem-utils";
import { Nat, Suc, ToUnary0, Z } from "./nat";
import { Op } from "./parser";


type NextAdr<S extends AnyState, O extends Op> =
    O extends Op & { tag: "[" }
    ? _ReadHere<S> extends Z
        ? O["gotoIfZero"]
        : Suc<S["prg"]["iptr"]>
    : O extends Op & { tag: "]" }
        ? O["goto"]
        : Suc<S["prg"]["iptr"]>


type WithNextAdr<S extends AnyState, O extends Op> =
    State<
        S["ptr"],
        S["mem"],
        Program<NextAdr<S, O>, S["prg"]["ops"]>,
        S["io"],
        S["done"]
    >


type ExecOp<S extends AnyState, O extends Op> =
    WithNextAdr<_ExecOp<S, O>, O>;


type _ExecOp<S extends AnyState, O extends Op> =  //-> AnyState
    O["tag"] extends "+"
    ? _WriteHere<S, Suc<GetOr0<S["mem"], S["ptr"]>>>

    : O["tag"] extends "-"
    ? _WriteHere<S, PredOr0<GetOr0<S["mem"], S["ptr"]>>>

    : O["tag"] extends ">"
    ? State<Suc<S["ptr"]>, S["mem"], S["prg"], S["io"], S["done"]>

    : O["tag"] extends "<"
    ? State<PredOr0<S["ptr"]>, S["mem"], S["prg"], S["io"], S["done"]>

    : O["tag"] extends "]"  | "["
    ? S

    : O["tag"] extends "."
    ? State<S["ptr"], S["mem"], S["prg"], IO<S["io"]["i"], [...S["io"]["o"], GetOr0<S["mem"], S["ptr"]>]>, S["done"]>

    : O["tag"] extends ","
    ? S  // TODO

    : State<S["ptr"], S["mem"], S["prg"], S["io"], "done">;


export type Step<S extends AnyState> =  //-> AnyState
    S["done"] extends "running"
    ? ExecOp<S, S["prg"]["ops"][S["prg"]["iptr"]]>
    : S;


type Program<
    Iptr extends Nat,
    Ops extends Record<string, Op>,
> = { iptr: Iptr, ops: Ops }
type AnyProgram = Program<Nat, Record<string, Op>>


type IO<
    I extends Nat[],
    O extends Nat[],
> = {i: I, o: O}
type AnyIO = IO<Nat[], Nat[]>


export type State<
    Ptr extends Nat,
    Mem extends Record<string, Nat>,
    Prg extends AnyProgram,
    IO extends AnyIO,
    Done extends "done" | "running",
> =
    {ptr: Ptr, mem: Mem, prg: Prg, io: IO, done: Done};

export type AnyState = State<Nat, Record<string, Nat>, AnyProgram, AnyIO, "done" | "running">;


export type InitialState<Ops extends Record<string, Op>> =
    State<Z, {}, Program<Z, Ops>, IO<[], []>, "running">;
export type AddInput<S extends AnyState, NewInput extends Nat[]> =
    State<
        S["ptr"],
        S["mem"],
        S["prg"],
        IO<[...S["io"]["i"], ...NewInput], S["io"]["o"]>,
        S["done"]
    >;


// expands object types one level deep
export type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;


type _ReadHere<S extends AnyState> =
    S["mem"][S["ptr"]];
type _WriteHere<S extends AnyState, N extends Nat> =
    State<
        S["ptr"],
        Expand<Omit<S["mem"], S["ptr"]> & Record<S["ptr"], N>>,
        S["prg"],
        S["io"],
        S["done"]
    >;


type GetOr0<R extends Record<string, Nat>, K extends string> =
    K extends keyof R
    ? R[K]
    : Z;


type PredOr0<N extends Nat> = N extends Suc<infer M> ? M : Z;


type _Repr<
    Mem extends string,
    Ptr extends string,
    Out extends string,
    Done extends string,
> = {RAM: Mem, Address: Ptr, Stdout: Out, done: Done}

export type Repr<S extends AnyState> =
    //@ts-ignore
    _Repr<MemRepr<S["mem"], S["ptr"]>, ToUnary0<S["ptr"]>, S["io"]["o"], S["done"]>

type ExtractOutput<S extends AnyState> = S["io"]["o"]
