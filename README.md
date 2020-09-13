# reactstate
Simple State Management for React

## Install

`npm i @attack-monkey/reactstate`

> See Setup & Typesafety

## How it works

### Add State

- Add state with the `AddState` component.
- The state stays alive (and available to the whole app) while the component stays alive, which allows you to position the node at the appropriate point in your app.
- When the AddState component is removed from the view then so is the state that it manages.

```tsx

import { AddState } from 'reactstate.config'

<MyApp>
  <AddState id="counter1" init={1}/>
  <AddState id="counter2" init={1}/>
</MyApp>

```

### Connect State into Components

To subscribe to state use `fromState`. Below we are creating a subscription called 'myComponent', and subscribing to 
both `counter1` and `counter2`.

```tsx

import { fromState } from 'reactstate.config.ts'

export const MyComponent = () => 
  fromState('myComponent', ['counter1', 'counter2'], ({ counter1, counter2 }) =>
      <>
        <h1>{counter1}</h1>
        <h1>{counter2}</h1>
      </>
    )

```

... and

```tsx

import { AddState } from 'reactstate.config'
import { MyComponent } from 'components/MyComponent'

<MyApp>
  <AddState id="counter1" init={1}/>
  <AddState id="counter2" init={1}/>
  <MyComponent />
</MyApp>

```

### Mutating State

Use `mutateState` to update state at a particular id.
Here we use a reusable `increment` function to mutate both 'counter1' and 'counter2' based on which button is pushed.

```tsx

import { connect, mutateState } from 'reactstate.config'

const increment = (stateKey, currentState) => mutateState(stateKey, currentState + 1)

const MyComponent = () =>
  fromState('myComponent', ['counter1', 'counter2'], ({ counter1, counter2 }) =>
    <>
      <h1>{counter1}</h1>
      <h1>{counter2}</h1>
      <button onClick={ () => increment('counter1', counter1) }>Increment counter 1</button>
      <button onClick={ () => increment('counter2', counter2) }>Increment counter 2</button>
    </>
  ) 


```

### Setup & Typesafety

reactstate works best with typescript

```typescript

// reactstate.config.ts

import { reactstate } from 'reactstate/lib'

export interface State {
  counter1?: number
  counter2?: number
}

interface Subscriptions {
  counter1?: {
    myComponent?: (state: State['counter1']) => void
  }
  counter2?: {
    myComponent?: (state: State['counter2']) => void
  }
}

// bootstrap reactState with State and Subscription info
export const { AddState, mutateState, fromState } = reactstate<State, Subscriptions>()

```

When you now import `AddState`, `fromState`, and `mutateState`from the above `reactstate.config.ts`, you'll get code hints and type inference - because reactstate knows the state of your app and what's subscribing to it.

