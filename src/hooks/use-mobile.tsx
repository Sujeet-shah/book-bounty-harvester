
import * as React from "react"

// Defining standard breakpoints for better reusability
export const BREAKPOINTS = {
  xs: 480,   // Extra small devices
  sm: 640,   // Small devices
  md: 768,   // Medium devices (tablets)
  lg: 1024,  // Large devices (laptops/desktops)
  xl: 1280,  // Extra large devices
  '2xl': 1536 // 2X Extra large devices
};

type BreakpointKey = keyof typeof BREAKPOINTS;

// Original isMobile hook for backward compatibility
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${BREAKPOINTS.md - 1}px)`);
    
    const onChange = () => {
      setIsMobile(window.innerWidth < BREAKPOINTS.md);
    };
    
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < BREAKPOINTS.md);
    
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}

// Enhanced hook for multi-breakpoint responsiveness
export function useBreakpoint(breakpoint: BreakpointKey = 'md') {
  const [isBelow, setIsBelow] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const threshold = BREAKPOINTS[breakpoint];
    const mql = window.matchMedia(`(max-width: ${threshold - 1}px)`);
    
    const onChange = () => {
      setIsBelow(window.innerWidth < threshold);
    };
    
    mql.addEventListener("change", onChange);
    setIsBelow(window.innerWidth < threshold);
    
    return () => mql.removeEventListener("change", onChange);
  }, [breakpoint]);

  return !!isBelow;
}

// Hook to get current breakpoint name
export function useCurrentBreakpoint() {
  const [current, setCurrent] = React.useState<BreakpointKey | undefined>(undefined);

  React.useEffect(() => {
    const determineBreakpoint = () => {
      const width = window.innerWidth;
      
      if (width < BREAKPOINTS.xs) return 'xs';
      if (width < BREAKPOINTS.sm) return 'xs';
      if (width < BREAKPOINTS.md) return 'sm';
      if (width < BREAKPOINTS.lg) return 'md';
      if (width < BREAKPOINTS.xl) return 'lg';
      if (width < BREAKPOINTS['2xl']) return 'xl';
      return '2xl';
    };
    
    const onChange = () => {
      setCurrent(determineBreakpoint());
    };
    
    window.addEventListener("resize", onChange);
    setCurrent(determineBreakpoint());
    
    return () => window.removeEventListener("resize", onChange);
  }, []);

  return current;
}
