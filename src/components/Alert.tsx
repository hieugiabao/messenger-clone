import React, { FC, useEffect } from "react";

interface AlertProps {
  isOpened: boolean;
  setIsOpened: (action: boolean) => void;
  content: string;
  isError?: boolean;
  duration?: number;
}

const Alert: FC<AlertProps> = ({
  isOpened,
  setIsOpened,
  content,
  isError = false,
  duration = 3000,
}) => {
  useEffect(() => {
    if (isOpened) {
      setTimeout(() => {
        setIsOpened(false);
      }, duration);
    }
  }, [isOpened]);

  return (
    <div
      className={`fixed top-5 right-5 z-50 w-[calc(100vw-40px)] max-w-[300px] scale-100 rounded p-4 text-white transition-all duration-300 ${
        isOpened
          ? "visible scale-100 opacity-100"
          : "invisible scale-50 opacity-0"
      } ${isError ? "bg-red-500" : "bg-[#323232]"}`}
    >
      {content}
    </div>
  );
};

export default Alert;
