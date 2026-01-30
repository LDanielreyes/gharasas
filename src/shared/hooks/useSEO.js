import { useEffect } from 'react';

export const useSEO = ({ title, description, image }) => {
    useEffect(() => {
        // Update Title
        document.title = title;

        // Update Meta Tags
        const setMetaTag = (selector, attribute, value) => {
            let element = document.querySelector(selector);
            if (!element) {
                element = document.createElement('meta');

                // Parse selector to set correct attributes
                if (selector.includes('name=')) {
                    element.setAttribute('name', selector.split('"')[1]);
                } else if (selector.includes('property=')) {
                    element.setAttribute('property', selector.split('"')[1]);
                }

                document.head.appendChild(element);
            }
            element.setAttribute(attribute, value);
        };

        if (description) {
            setMetaTag('meta[name="description"]', 'content', description);
            setMetaTag('meta[property="og:description"]', 'content', description);
            setMetaTag('meta[name="twitter:description"]', 'content', description);
        }

        if (title) {
            setMetaTag('meta[property="og:title"]', 'content', title);
            setMetaTag('meta[name="twitter:title"]', 'content', title);
        }

        if (image) {
            setMetaTag('meta[property="og:image"]', 'content', image);
            setMetaTag('meta[name="twitter:image"]', 'content', image);
        }

        // Cleanup function (optional: reset to default?)
        // In a SPA, the next page's useSEO will overwrite this.

    }, [title, description, image]);
};
