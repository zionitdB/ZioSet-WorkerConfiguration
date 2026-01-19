import React, { useEffect } from "react";

// Define the prop types for the component
interface HelmetTitleProps {
  title: string;
}

const HelmetTitle: React.FC<HelmetTitleProps> = ({ title }) => {
  useEffect(() => {
    document.title = title; 
  }, [title]); 

  return null; 
};

export default HelmetTitle;
