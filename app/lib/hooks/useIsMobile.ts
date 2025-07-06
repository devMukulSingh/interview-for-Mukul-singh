"use client";

import { useEffect, useState } from "react";

const useIsMobile = (): boolean => {
  const mediaQuery: string = "(max-width: 640px)";

  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQueryList: MediaQueryList = window.matchMedia(mediaQuery);

      const handleMediaQueryChange = (event: MediaQueryListEvent) => {
        setIsMobile(event.matches);
      };

      setIsMobile(mediaQueryList.matches);

      mediaQueryList.addEventListener("change", handleMediaQueryChange);

      return () => {
        mediaQueryList.removeEventListener("change", handleMediaQueryChange);
      };
    }
  }, [mediaQuery]);

  return isMobile;
};

export default useIsMobile;
