import React, { createContext, useContext, useState } from "react";
const RootContext = createContext(null);
function useRootLayout() {
    const ctx = useContext(RootContext);
    if (!ctx) {
        throw new Error("useTopAppBar deve ser usado dentro do RootProvider");
    }
    return ctx;
}
function RootProvider(props) {
    const [topBarTitle, setTopBarTitle] = useState(null);
    const [topBarChildren, setTopBarChildren] = useState(null);
    return (React.createElement(RootContext.Provider, { value: {
            topBarTitle, setTopBarTitle,
            topBarChildren, setTopBarChildren
        } }, props.children));
}
export { RootContext, useRootLayout, RootProvider };
