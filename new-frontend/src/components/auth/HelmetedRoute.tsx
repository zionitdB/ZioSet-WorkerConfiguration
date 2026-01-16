import React from "react";
import HelmetTitle from "./HelmetTitle";
interface HelmetedRouteProps {
  title: string;
  element: React.ReactNode; 
}

const HelmetedRoute: React.FC<HelmetedRouteProps> = ({ title, element }) => (
  <>
    <HelmetTitle title={`${title}`} />
    {element}
  </>
);

export default HelmetedRoute;
