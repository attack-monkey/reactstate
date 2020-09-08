# reactstate
Simple State Management for React

## How it works

### Add State

- Add state with the `AddState` component.
- The state stays alive (and available to the whole app) while the component stays alive, which allows you to position the node at the appropriate point in your app.

```jsx

import { AddState } from 'reactstate.config'

<MyApp>
  <AddState id="counter1" init={1}/>
  <AddState id="counter2" init={1}/>
</MyApp>

```

### Connect State into Components

In the snippet below `connect` creates a subscription with the id `myComponent`.
The subscription subscribes to both `counter1` and `counter2`.
Whenever either of them change state - `MyComponent` is re-rendered.
When the Component unmounts - the subscription is automatically cleaned up.

```jsx

import { connect } from 'reactstate.config'

const MyComponent = () => {
  const { counter1, counter2 } = connect(['counter1', 'counter2'], 'myComponent')
  return (
    <div>
      <h1>{counter1}</h1>
      <h1>{counter2}</h1>
    </div>
  )
}

```

### Mutating State

Use `mutateState` to update state at a particular id.
Here we use a reusable `increment` function to mutate both 'counter1' and 'counter2' based on which button is pushed.

```jsx

import { connect, mutateState } from 'reactstate.config'

const increment = (stateKey, currentState) => mutateState(stateKey, currentState + 1)

const MyComponent = () => {
  const { counter1, counter2 } = connect(['counter1', 'counter2'], 'myComponent')
  return (
    <div>
      <h1>{counter1}</h1>
      <h1>{counter2}</h1>
      <button onClick={ () => increment('counter1', counter1) }>Increment counter 1</button>
      <button onClick={ () => increment('counter2', counter2) }>Increment counter 2</button>
    </div>
  )
}

```

### Setup & Typesafety

reactstate works best with typescript

```typescript

// reactstate.config.ts

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

export const { AddState, mutateState, connect } = reactstate<State, Subscriptions>()

```

Now import `AddState`, `connect`, and `mutateState`from the above `reactstate.config.ts`. Now as you write you'll get code hints - because reactstate knows the state of your app and what's subscribing to it.

