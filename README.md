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

In the snippet below `connect` creates a subscription with the key `myComponent`.
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

Use `mutateState` to update the state of corresponding id.
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
