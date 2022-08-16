import React, { FC, useEffect, useRef } from "react";

interface ClickListenerProps {
  onClick: () => void;
  children: (ref: any) => any;
}

const ClickListener: FC<ClickListenerProps> = ({ onClick, children }) => {
  const childrenRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handler = (e: any) => {
      if (childrenRef.current && !childrenRef.current.contains(e.target)) {
        onClick();
      }
    };

    window.addEventListener("click", handler);

    return () => {
      window.removeEventListener("click", handler);
    };
  }, []);

  return <>{children(childrenRef)}</>;
};

export default ClickListener;
