import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';

export default function Rating({ value, onChange, margin }) {
    const [hovered, setHovered] = useState(null);

    return (
        <div style={{ display: 'flex', gap: '6px', marginBottom:`${margin}px` }}>
            {[1, 2, 3, 4, 5].map((index) => {
                const isFilled = index <= (hovered ?? value);

                return (
                    <FaStar
                        key={index}
                        size={32}
                        color={isFilled ? '#f5c518' : '#e4e5e9'}
                        style={{ cursor: 'pointer', transition: 'color 0.2s' }}
                        onClick={() => onChange(index)}
                        onMouseEnter={() => setHovered(index)}
                        onMouseLeave={() => setHovered(null)}
                    />
                );
            })}
        </div>
    );
}
