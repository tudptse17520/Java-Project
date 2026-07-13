import { useState, useEffect } from "react";

export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState<boolean>(false);

    useEffect(() => {
        const mediaQueryList = window.matchMedia(query);
        const documentChangeHandler = (event: MediaQueryListEvent) => {
            setMatches(event.matches);
        };

        // Set giá trị ban đầu
        setMatches(mediaQueryList.matches);

        // Lắng nghe sự thay đổi
        mediaQueryList.addEventListener("change", documentChangeHandler);

        return () => {
            mediaQueryList.removeEventListener("change", documentChangeHandler);
        };
    }, [query]);

    return matches;
}