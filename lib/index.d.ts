export declare const addState: <S>() => <K extends keyof S>(key: K, subState: S[K]) => void;
export declare const getState: <S>(key: keyof S) => S[keyof S];
export declare const mutateState: <S>() => <K extends keyof S>(key: K, newState: S[K]) => void;
export declare const deleteState: <S>(key: keyof S) => void;
export declare const subscribe: <Su>() => <K extends keyof Su, SK extends keyof Su[K]>(key: K, subKey: SK, fn: Su[K][SK]) => void;
export declare const unsubscribe: <Su>() => <K extends keyof Su, SK extends keyof Su[K]>(key: K, subKey: SK) => void;
export declare const connect: <S, Su>() => <K extends keyof Su & keyof S, SK extends keyof Su[K]>(keys: K[], subKey: SK) => Partial<S>;
export declare const fromState: <S, Su>() => <K extends keyof Su & keyof S, SK extends keyof Su[K], B>(subKey: SK, keys: K[], subFn: (partialState: Partial<S>) => B) => B;
interface AddStateProps<S> {
    id: keyof S;
    init: S[keyof S];
}
export declare const AddState: <S>() => ({ id: stateId, init }: AddStateProps<S>) => null;
export declare const reactstate: <S, Su>() => {
    AddState: ({ id: stateId, init }: AddStateProps<S>) => null;
    mutateState: <K extends keyof S>(key: K, newState: S[K]) => void;
    connect: <K_1 extends keyof Su & keyof S, SK extends keyof Su[K_1]>(keys: K_1[], subKey: SK) => Partial<S>;
    fromState: <K_2 extends keyof Su & keyof S, SK_1 extends keyof Su[K_2], B>(subKey: SK_1, keys: K_2[], subFn: (partialState: Partial<S>) => B) => B;
};
export {};
