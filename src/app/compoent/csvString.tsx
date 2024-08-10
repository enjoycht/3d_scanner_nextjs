'use client'
import React, { useState, useEffect } from 'react';
import Papa, { ParseResult } from 'papaparse';

const CsvString = (url: string) => {
    const [data, setData] = useState<number[][]>([]);

    useEffect(() => {
        fetch(url)
            .then(response => response.text())
            .then(csvString => {
                Papa.parse(csvString, {
                    header: false,
                    complete: (results: ParseResult<string[]>) => {
                        const parsedData = results.data.map((row: string[]) => parseFloat(row[0]));
                        const chunkedData: number[][] = [];
                        for (let i = 0; i < parsedData.length; i += 3) {
                            chunkedData.push(parsedData.slice(i, i + 3));
                        }
                        setData(chunkedData);
                    }
                });
            });
    }, [url]);

    return data;
};

export default CsvString;