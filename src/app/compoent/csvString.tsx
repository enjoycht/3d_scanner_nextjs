'use client'
import React, { useState, useEffect } from 'react';
import Papa, { ParseResult } from 'papaparse';

const CsvString = (url: string) => {
    const [data, setData] = useState<number[][]>([]);

    useEffect(() => {
        if (!url || url === "" || url === undefined || url.includes("github.io")) {
            return;
        }

        const ws = new WebSocket(`ws://${url}/ws`);

        ws.onmessage = (event) => {
            // 解析 JSON
            const csvString = JSON.parse(event.data);
            console.log('csvString:', csvString.points);
            const csvPoints = csvString.points;

            // 確認是否為陣列
            if (Array.isArray(csvPoints)) {
                const parsedData = csvPoints.map((row: string[]) => row.map(value => parseFloat(value) * 0.01));
                console.log('parsedData:', parsedData);
                setData(prevData => [...prevData, ...parsedData]);
            } else {
                console.error('csvPoints is not an array:', csvPoints);
            }
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        ws.onclose = () => {
            console.log('WebSocket connection closed');
        };

        return () => {
            ws.close();
        };
    }, [url]);

    return data;
};

export default CsvString;