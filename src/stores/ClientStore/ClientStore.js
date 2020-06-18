import React from 'react'

export const initial = () => {}
export const Context = React.createContext([{}, initial])

export const Provider = ({ agent, children }) => (
  <Context.Provider value={agent}>
    {children}
  </Context.Provider>
)
