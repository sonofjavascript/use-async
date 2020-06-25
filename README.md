![npm](https://img.shields.io/npm/v/@sonofjs/use-async.svg) [![Build Status](https://travis-ci.org/sonofjavascript/use-async.svg?branch=master)](https://travis-ci.org/sonofjavascript/use-async) [![Coverage Status](https://coveralls.io/repos/github/sonofjavascript/use-async/badge.svg)](https://coveralls.io/github/sonofjavascript/use-async) [![MIT license](http://img.shields.io/badge/license-MIT-blue.svg)](http://opensource.org/licenses/MIT)

# useAsync
<img src='https://onix-systems.com/uploads/eYdjjAuPgNzIPbGGJtMORLRQ9kYyQeKo.jpg' />

*useReducer* hook's extension to manage asynchronous actions over application's state through http requests.

## Use case
*useReducer* hook is very useful for managing application's state, but... What about if you want to integrate http requests on the state's actions? *useAsync* hook allows you to manage it in an easy way.

## How?
Specify an http client with *get*, *post*, *put* and *delete* methods through the *ClientStore*. You can use *axios*, *fetch* or any other http client. [See Client Store](#client-store).

Define an actions object with this pattern for the common actions:
```js
const actions = {
  ...
  ACTION_TYPE: (state, payload) => ({
    ...state,
    data: payload
  }),
  ASYNC_ACTION: (state) => ({
    ...state,
    request: {
      method: 'GET',
      url: '/api/data'
    }
  })
  ...
}
```
Note: *reducers are commonly defined through switch statements. Author's preference is to use always objects instead of those.*


The `request` key in the `ASYNC_ACTION` type indicates this action is asynchronous. In this example, the client agent will execute a `get` http call to the url `/api/data`. Optionally, to manage the state when the request has been successfully executed add an action with the same type followed by `_SUCCESS`; and to manage the state when the request has failed add an action with the same type followed by `_ERROR`. [See Actions, Dispatches and State](#actions-dispatches-and-state).

Then, you only have to pass this actions objet to the `useAsync` hook. 

```js
const [state, dispatch] = useAsync(actions, initialState)
```

Note: *You can specify an optional initial state as a second argument. The default one is an empty object.*

## Installation
```
npm install --save @sonofjs/use-async
```

## Usage
This is a very simple example showing how to use the `useAsync` hook.
* `axios` is used as client agent
* Example action types:
    *  `FETCH_DATA`: dispatched on the `useEffect`hook of `Component`. It has a `request` key in the output of the action, which indicates the client agent that should make an http request.
    *  `FETCH_DATA_SUCCESS`: will be dispatched if the http call throwed through the `FETCH_DATA` action has been successfully executed.
    *  `FETCH_DATA_ERROR`: will be dispatched if the http call throwed through the `FETCH_DATA` action has failed.
    *  `CREATE`: dispatched on the button click event. Will throw an http POST request.
    *  `CREATE_SUCCESS`: will be dispatched if the http call throwed through the `CREATE` action has been successfully executed.
    *  `CREATE`: will be dispatched if the http call throwed through the `CREATE` action has failed.
    *  `UPDATE`: will throw an http PUT request.
    *  `DELETE`: will throw an http DELETE request.

Note: *the `*_SUCCESS` and `*_ERROR` actions are optionals.*

### Client store
Specify the client agent through the `ClientStore`.

```js
import React from 'react'

import { ClientStore } from '@sonofjs/use-async'
import axios from 'axios'

import Component from './Component.jsx'

const ViewContainer = () => (
  <ClientStore.Provider agent={axios}>
    <Component />
  </ClientStore.Provider>
)

export default ViewContainer
```

### Actions, dispatches and state
Define the state actions and use the `useAsync` hook to manage it.

```js
import React, { useEffect } from 'react'
import useAsync from '@sonofjs/use-async'

const actions = {
  FETCH_DATA: (state) => ({
    ...state,
    loading: true,
    request: {
      method: 'GET',
      url: '/api/data'
    }
  }),
  FETCH_DATA_SUCCESS: (state, response) => ({
    ...state,
    loading: false,
    data: response
  }),
  FETCH_DATA_ERROR: (state, error) => ({
    ...state,
    loading: false,
    error
  }),
  CREATE: (state, payload) => ({
    ...state,
    request: {
      method: 'POST',
      url: '/api/data',
      body: payload
    }
  }),
  CREATE_SUCCESS: (state, response) => ({
    ...state,
    data: response
  }),
  CREATE_ERROR: (state, error) => ({
    ...state,
    error
  }),
  UPDATE: (state, payload) => ({
    ...state,
    request: {
      method: 'PUT',
      url: '/api/data',
      body: payload
    }
  }),
  DELETE: (state, payload) => ({
    ...state,
    request: {
      method: 'DELETE',
      url: '/api/data',
      body: payload
    }
  })
}

const initialState = {
  loading: false,
  data: {}
}

const Component = () => {
  const [state, dispatch] = useAsync(actions, initialState)

  useEffect(() => {
    dispatch({ type: 'FETCH_DATA' })
  }, [])

  const create = () => dispatch({ type: 'CREATE', payload: { name: '::name::' } })

  return (
    <>
      {state.loading ? <span>Loading...</span> : null}
      {<span>{JSON.stringify(state.data)}</span>}
      {state.error ? <span>Error: {JSON.stringify(state.error)}</span> : null}
      <button onClick={create}>Create</button>
    </>
  )
}

export default Component
```

### Custom client agent
Interceptors and other methods can be used meanwhile the client agent is used by the `asyncAction` hook. To connect the client to the store and use its state data implement a method named `connect` in your client.

```js
/* Your client agent */
import axios from 'axios'

const client = axios.create({
  baseURL: '/api',
  responseType: 'json'
})

const setToken = (config, { store = {} }) => {
  const { token } = store
  if (!token) return

  config.headers.Authorization = `Token ${token}`
}

client.interceptors.request.use(config => {
  setToken(config, client)
  return config
})

client.connect = ({ state: { token } }) => {
  client.store = { token }
}

export default client

...

/* Use of ClientStore */
import React from 'react'

import { ClientStore } from 'use-async'
import clientAgent from './clientAgent'

import Component from './Component.jsx'

const ViewContainer = () => (
  <ClientStore.Provider agent={clientAgent}>
    <Component />
  </ClientStore.Provider>
)

export default ViewContainer

```

The `connect` method will be fired on every state change.

## Contributing
Contributions welcome; Please submit all pull requests the against master branch. If your pull request contains JavaScript patches or features, you should include relevant unit tests. Please check the [Contributing Guidelines](contributng.md) for more details. Thanks!

## Author
Albert Pérez Farrés 

## License
 - **MIT** : http://opensource.org/licenses/MIT
