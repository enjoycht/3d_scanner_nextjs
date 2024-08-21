'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { useUrl } from './UrlContext';

interface InfoContextType {
    info: any;
    setInfo: (newInfo: any) => void;
}

// Create the context
export const InfoContext = createContext<InfoContextType | undefined>(undefined);

export const InfoProvider = ({ children }: { children: ReactNode }) => {
    const { url, setUrl } = useUrl();
    const [info, setInfoState] = useState({
        code: -1,
        status: "",
        path: "",
        version: "",
        mdns: "",
        sta: {
            ssid: "",
            password: "",
        },
        ap: {
            ssid: "",
            password: "",
        },
        github: {
            username: "",
            repo: ""
        },
        module: {
            z_axis_max: "",
            z_axis_one_time_step: "",
            z_axis_delay_time: "",
            z_axis_start_step: "",
            x_y_axis_max: "",
            x_y_axis_check_times: "",
            x_y_axis_one_time_step: "",
            x_y_axis_step_delay_time: "",
            vl53l1x_center: "",
            vl53l1x_timeing_budget: ""
        }
    });

    useEffect(() => {
        if (!url || url === "" || url === undefined || url.includes("github.io")) { return; }
        axios.get(`http://${url}/api/info`)
            .then(response => {
                setInfo(response.data["data"]);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, [url]);

    const setInfo = (newInfo: any) => {
        setInfoState(newInfo);
    };

    return (
        <InfoContext.Provider value={{ info, setInfo }}>
            {children}
        </InfoContext.Provider>
    );
};

// Custom hook to use the InfoContext
export const useInfo = () => {
    const context = useContext(InfoContext);
    if (!context) {
        throw new Error('useInfo must be used within an InfoProvider');
    }
    return context;
};
