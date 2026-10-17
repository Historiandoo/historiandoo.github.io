import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToLocation() {
    const { pathname, hash } = useLocation();
    useEffect(() => {
        if (hash) {
            const frame = requestAnimationFrame(() => document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView());
            return () => cancelAnimationFrame(frame);
        }
        window.scrollTo(0, 0);
    }, [pathname, hash]);
    return null;
}
