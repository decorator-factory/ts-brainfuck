import { AnyState, InitialState, Repr, Step } from "./src/brainfuck";
import { Parse, TupleToRec } from "./src/parser";


type NaiveInterpreter<S extends AnyState> =
    S["done"] extends "done"
    ? S
    : NaiveInterpreter<Step<S>>


type _state = InitialState<TupleToRec<Parse<"++>+++[-<+>]<.">>>;

type _final_state = NaiveInterpreter<_state>;

type _pretty = Repr<_final_state>;