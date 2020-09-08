import { useEffect, useState, SetStateAction, Dispatch } from "react"

let state = {} as Record<string, any>
let subscriptions = {}

export const addState = <S>() => <K extends keyof S>(key: K, subState: S[K]) => {
  (state as S)[key]
    ? (() => { throw new Error(`state[${key}] already exists. Please provide a unique key`) })()
    : (state as S)[key] = subState
}

export const getState = <S>(key: keyof S) => (state as S)[key]

export const mutateState = <S>() => <K extends keyof S>(key: K, newState: S[K]) => {
  (state as S)[key] = newState
  Object.keys((subscriptions as any)[key]).forEach(subKey => (subscriptions as any)[key][subKey](newState))
}

export const deleteState = <S>(key: keyof S) => { delete (state as S)[key] }

export const subscribe = <Su>() => <K extends keyof Su, SK extends keyof Su[K]>(key: K, subKey: SK, fn: Su[K][SK]) => {
  (subscriptions as Su)[key] = (subscriptions as Su)[key] ? (subscriptions as Su)[key] : {} as Su[K]
  (subscriptions as Su)[key][subKey] = fn
}

export const unsubscribe = <Su>() => <K extends keyof Su, SK extends keyof Su[K]>(key: K, subKey: SK) => {
  delete (subscriptions as Su)[key][subKey]
}

export const connect = <S, Su>() => <K extends keyof Su & keyof S, SK extends keyof Su[K]>(keys: K[], subKey: SK): Partial<S> => {
  const states: Array<(S[K])> = []
  const setStates: Array<Dispatch<SetStateAction<(S[K])>>> = []
  keys.forEach((key, i) => {
    [states[i], setStates[i]] = useState(getState<S>(key) as S[K])
    useEffect(() => {
      subscribe<Su>()(key, subKey, ((newValue: S[K]) => { setStates[i](newValue) }) as any)
      return () => {
        unsubscribe<Su>()(key, subKey)
      }
    })
  })
  return keys.reduce((ac: S, key: K, i: number) => ({ ...ac, [key]: states[i] }), {} as S)
}

interface AddStateProps<S> {
  id: keyof S,
  init: S[keyof S]
}

export const AddState = <S>() => ({ id, init }: AddStateProps<S>) => {
  const state = getState<S>(id)
  !state && addState<S>()(id, init)
  useEffect(() => {
    return () => deleteState<S>(id)
  })
  return null
}

export const reactstate = <S, Su>() => ({
  AddState: AddState<S>(),
  mutateState: mutateState<S>(),
  connect: connect<S, Su>()
})