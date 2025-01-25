import React, { createContext, useContext, useState } from "react";

export const RenderContext = createContext<{
    trigger: boolean;
    setTrigger: React.Dispatch<React.SetStateAction<boolean>>;
} | null>(null);

export const RenderProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [trigger, setTrigger] = useState(false);
    return (
        <RenderContext.Provider value={{ trigger, setTrigger }}>
            {children}
        </RenderContext.Provider>
    );
};

export const useRenderContext = () => {
    const context = useContext(RenderContext);
    if (!context) {
        throw new Error(
            "useRenderContext must be used within a RenderProvider"
        );
    }
    return context;
};
