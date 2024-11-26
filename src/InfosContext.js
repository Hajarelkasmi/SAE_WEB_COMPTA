import React, {createContext, useState, useEffect} from 'react';
import { checkInfos } from "./CheckInfos";

export const InfosContext = createContext(undefined);

export const InfosProvider = ({children}) => {
    const [isAdmin, setIsAdmin] = useState(null);
    const [isAbonne, setIsAbonne] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const infos = await checkInfos();
            setIsAdmin(infos.isAdmin);
            setIsAbonne(infos.isAbonne);
        };
        fetchData();
    }, []);

    return (
        <InfosContext.Provider value={{isAdmin, isAbonne}}>
            {children}
        </InfosContext.Provider>
    );
}