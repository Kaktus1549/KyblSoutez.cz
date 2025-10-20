import React, { useState, useEffect } from 'react';

export default function Loading() {
    const [loadingText, setLoadingText] = useState('Loading...');

    useEffect(() => {
        const interval = setInterval(() => {
            setLoadingText((prev) => (prev === 'Loading...' ? 'Loading..' : 'Loading...'));
        }, 500);

        return () => clearInterval(interval);
    }, []);

    return(
        <div className="loading-container">
            <div className="spinner"></div>
            <p className='loading'>{loadingText}</p>
        </div>
    );
}