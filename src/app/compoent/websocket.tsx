'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useUrl } from './UrlContext';

interface MsgContextType {
    stopMsg: { z_steps: number; vl53l1x: number; };
    setStopMsg: (newMsg: any) => void;
    scanMsg: any;
    setScanMsg: (newMsg: any) => void;
}

// Create the context
export const MsgContext = createContext<MsgContextType | undefined>(undefined);

export const MsgProvider = ({ children }: { children: ReactNode }) => {
    const { url, setUrl } = useUrl();

    const [stopMsg, setStopMsg] = useState({
        z_steps: 0,
        vl53l1x: 0
    });
    const [scanMsg, setScanMsg] = useState({
        name: "",
        points_count: 0,
        is_last: false,
        points: []
    });

    const [ws, setWs] = useState<WebSocket | null>(null);

    useEffect(() => {
        if (!url || url === "" || url === undefined || url.includes("github.io")) { return; }
        const ws = new WebSocket(window.location.protocol === "https:" ? `wss://${url}/ws` : `ws://${url}/ws`);
        setWs(ws);
        ws.onopen = () => {
            console.log('WebSocket connected');
        };

        ws.onclose = () => {
            console.log('WebSocket disconnected');
        };

        ws.onerror = (event) => {
            console.log('WebSocket error:', event);
        };

        ws.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            if (msg["name"] !== undefined && msg["points_count"] !== undefined && msg["is_last"] !== undefined && msg["points"] !== undefined) {
                setScanMsg(msg);
            } 

            if (msg["z_steps"] !== undefined && msg["vl53l1x"] !== undefined) {
                setStopMsg(msg);
            }
        };

        return () => {
            ws.close();
        };
    }, [url]);

    return (
        <MsgContext.Provider value={{ stopMsg, setStopMsg, scanMsg, setScanMsg }}>
            {children}
        </MsgContext.Provider>
    );
};

// Custom hook to use the MsgContext
export const useMsg = () => {
    const context = useContext(MsgContext);
    if (!context) {
        throw new Error('useMsg must be used within an MsgProvider');
    }
    return context;
};
