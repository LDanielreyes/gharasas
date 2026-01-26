import React from 'react';
import { cn } from '../../utils/cn';

const Section = ({ children, className, id }) => {
    return (
        <section id={id} className={cn('container mx-auto max-w-7xl', className)}>
            {children}
        </section>
    );
};

export default Section;
