import React, {createContext, useState, useEffect} from 'react';
import { checkInfos } from "./CheckInfos";

export const InfosContext = createContext(undefined);

export const InfosProvider = ({children}) => {
    const [isAdmin, setIsAdmin] = useState(null);
    const [idUser, setIdUser] = useState(null);
    const IP_api = "https://laprofdecompta.fr/api";

    useEffect(() => {
        const fetchData = async () => {
            const infos = await checkInfos();
            setIsAdmin(infos.isAdmin);
            setIdUser(infos.idUser);
        };
        fetchData();
    }, []);

    return (
        <InfosContext.Provider value={{isAdmin, idUser, IP_api}}>
            {children}
        </InfosContext.Provider>
    );
}