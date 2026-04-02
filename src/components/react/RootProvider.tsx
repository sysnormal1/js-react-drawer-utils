import React, { createContext, ReactNode, useContext, useState } from "react";


const RootContext = createContext<any>(null);

function useRootLayout() {
  const ctx = useContext(RootContext);

  if (!ctx) {
    throw new Error("useTopAppBar deve ser usado dentro do RootProvider");
  }

  return ctx;
}

function RootProvider(props?: any) {
    const [topBarTitle,setTopBarTitle] = useState<string|number|null|undefined>(null);    
    const [topBarChildren,setTopBarChildren] = useState<string|number|ReactNode|null|undefined>(null);

    return (
        <RootContext.Provider 
            value={{    
                topBarTitle,setTopBarTitle,
                topBarChildren,setTopBarChildren
            }}
        >
            {props.children}
        </RootContext.Provider>
    )
}

export {RootContext, useRootLayout, RootProvider };