'use client'
import React, { useState, useEffect } from 'react';
import Papa, { ParseResult } from 'papaparse';

const CsvString = (url: string) => {
    const [data, setData] = useState<number[][]>([]);

    // useEffect(() => {
    //     fetch(url)
    //         .then(response => response.text())
    //         .then(csvString => {
    //             Papa.parse(csvString, {
    //                 header: false,
    //                 complete: (results: ParseResult<string[]>) => {
    //                     const parsedData = results.data.map((row: string[]) => row.map(value => parseFloat(value) * 0.01));
    //                     setData(parsedData);
    //                 }
    //             });
    //     });
    // }, [url]);

    useEffect(() => {
        const ws = new WebSocket(url);

        ws.onmessage = (event) => {
            const csvString = event.data;
            Papa.parse(csvString, {
                header: false,
                complete: (results: ParseResult<string[]>) => {
                    const parsedData = results.data.map((row: string[]) => row.map(value => parseFloat(value) * 0.01));
                    setData(prevData => [...prevData, ...parsedData]);
                }
            });
        };

        return () => {
            ws.close();
        };
    }, [url]);

    return data;
};

export default CsvString;