import React from 'react'

export const Context = React.createContext([{}, () => {}])

export const Provider = ({ agent, children }) => (
  <Context.Provider value={agent}>
    {children}
  </Context.Provider>
)
