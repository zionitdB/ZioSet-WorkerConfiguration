import { useEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";
import LoadingBar, { LoadingBarRef } from "react-top-loading-bar";

export function NavigationProgress() {
  const ref = useRef<LoadingBarRef>(null);
  const location = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    // Start the loading bar when route changes
    ref.current?.continuousStart();
    const timer = setTimeout(() => {
      ref.current?.complete();
    }, 500); 

    return () => clearTimeout(timer);
  }, [location, navigationType]);

  return (
    <LoadingBar
  color="var(--primary)"
      ref={ref}
      shadow={true}
      height={3}
      loaderSpeed={400}
    />
  );
}
