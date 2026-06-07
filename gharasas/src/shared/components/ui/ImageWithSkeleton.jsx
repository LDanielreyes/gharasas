import React, { useState } from 'react';
import { Skeleton } from './Skeleton';
import { motion } from 'framer-motion';

const ImageWithSkeleton = ({ src, alt, className, containerClassName, ...props }) => {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <div className={`relative overflow-hidden ${containerClassName}`}>
            {!isLoaded && (
                <Skeleton className={`absolute inset-0 z-10 w-full h-full ${className}`} />
            )}
            <motion.img
                src={src}
                alt={alt}
                className={`${className} transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setIsLoaded(true)}
                {...props}
            />
        </div>
    );
};

export default ImageWithSkeleton;
