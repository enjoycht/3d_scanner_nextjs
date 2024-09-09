'use client';

import React , { createContext , useContext , useState , useEffect , ReactNode } from 'react' ;

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

interface UrlContextType {

    url: string ;
    setUrl: ( url: string ) => void ;

}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

const UrlContext = createContext<UrlContextType | undefined>(undefined);

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

export const UrlProvider = ( { children }: { children: ReactNode } ) => {

    const [ url, setUrlState ] = useState<string>( '' ) ;

    useEffect ( () => {

        if ( typeof window !== 'undefined' ) {

            const storedUrl = localStorage.getItem ( 'url' ) || window.location.host ;
            setUrlState ( storedUrl ) ;

        }

    } , [] ) ;

    useEffect ( () => {

        if ( typeof window !== 'undefined' && url ) {

            localStorage.setItem ( 'url' , url ) ;

        }

    } , [ url ] ) ;

    const setUrl = ( newUrl: string ) => {

        setUrlState ( newUrl ) ;

    } ;

    return (

        <UrlContext.Provider value={ { url , setUrl } }>

            { children }

        </UrlContext.Provider>

    ) ;

} ;

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

export const useUrl = () => {

    const context = useContext ( UrlContext ) ;

    if ( !context ) {

        throw new Error ( 'useUrl must be used within a UrlProvider' ) ;

    }

    return context ;

} ;

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
