'use client';

import React , { createContext , useContext , useState , useEffect , ReactNode } from 'react' ;
import { useUrl } from './UrlContext' ;
import { useInfo } from './info' ;

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

interface MsgContextType {

    stopMsg: { z_steps: number ; vl53l1x: number ; } ;
    setStopMsg: ( newMsg: any ) => void ; 
    scanMsg: { name: string ; points_count: number ; is_last: boolean ; z_steps: number ; r: number ; points: number[][] , time: number } ;
    setScanMsg: ( newMsg: any ) => void ;
    points: number [][] ;
    setPoints: ( newPoints: number [][] ) => void ;
    status: string ;
    setStatus: ( newStatus: string ) => void ;
    name: string ;
    setName: ( newName: string ) => void ;

}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Create the context
export const MsgContext = createContext<MsgContextType | undefined>( undefined ) ;

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

export const MsgProvider = ( { children }: { children: ReactNode } ) => {

    const { url , setUrl } = useUrl () ;
    const { getInfo } = useInfo () ;

    const [ status , setStatus ] = useState<string>( "disconnect" ) ;
    const [ name , setName ] = useState<string>( "" ) ;

    const [ stopMsg , setStopMsg ] = useState ( {

        z_steps: 0 ,
        vl53l1x: 0

    } ) ;

    const [ scanMsg , setScanMsg ] = useState ( {

        name: "" ,
        points_count: 0 ,
        is_last: false ,
        z_steps: 0 ,
        r: 0 ,
        time: 0 ,
        points: []

    } ) ;

    const [ points , setPoints ] = useState<number [][]>( [] );

    const [ ws, setWs ] = useState<WebSocket | null>( null ) ;

    const connectWebSocket = () => {

        if (!url || url === "" || url === undefined || url.includes ( "github.io" ) ) { 
        	
            return ; 
            
        }

        const ws = new WebSocket ( window.location.protocol === "https:" ? `wss:	//${url}/ws` : `ws://${url}/ws`);
        setWs ( ws ) ;

        ws.onopen = () => {

            console.log( 'WebSocket connected' ) ;
            getInfo () ;

        } ;

        ws.onclose = () => {

            console.log ( 'WebSocket disconnected' ) ;
            setStatus ( "disconnect" ) ;
            setTimeout ( connectWebSocket , 5000 ) ;				// 每5秒重新連線

        };

        ws.onerror = (event) => {

            console.log( 'WebSocket error:' , event ) ;

        } ;

        ws.onmessage = ( event ) => {

            console.log('WebSocket message:', event.data);
            const msg = JSON.parse(event.data);
            console.log('WebSocket message:', msg);

            if (msg["status"] === "scan") {

                setStatus("scan");

            } else if ( msg [ "status" ] === "stop" ) {

                if (msg [ "name" ] !== "" ) {

                    setStatus ( "stop" ) ;

                } else {

                    setStatus ( "end" ) ;

                }

            }

            if ( msg [ "name" ] !== undefined ) {

                setName ( msg [ "name" ] ) ;

            }

            if ( msg [ "name" ] !== undefined && msg [ "points_count" ] !== undefined && msg [ "is_last" ] !== undefined && msg [ "points" ] !== undefined ) {

                setScanMsg ( msg ) ;
                setPoints ( prevPoints => [...prevPoints, ...msg.points.map ( ( point: number[] ) => point.map ( ( value: number ) => value * 0.01 ) ) ] ) ;

            } 

            if ( msg [ "z_steps" ] !== undefined && msg [ "vl53l1x" ] !== undefined ) {

                setStopMsg ( msg ) ;

            }

        } ;

    } ;

    useEffect ( () => {

        connectWebSocket () ;

        return () => {

            ws?.close () ;

        } ;

    } , [ url ] ) ;

    useEffect(() => {

        console.log ( 'Points state updated:' , points ) ;

    } , [ points ] ) ;

    return (

        <MsgContext.Provider value= { { stopMsg , setStopMsg , scanMsg , setScanMsg , points , setPoints , status , setStatus , name , setName } }>

            { children }

        </MsgContext.Provider>

    ) ;

} ;

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// ~~~~~~ Custom hook to use the MsgContext
export const useMsg = () => {

    const context = useContext(MsgContext);

    if ( !context ) {

        throw new Error ( 'useMsg must be used within an MsgProvider' ) ;

    }

    return context ;

} ;

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
