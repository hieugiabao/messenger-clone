import React, { FC, HTMLProps } from "react";

const Skeleton: FC<HTMLProps<HTMLDivElement>> = ({ className, ...other }) => {
  return (
    <div className={`animate-pulse bg-gray-500 ${className}`} {...other}></div>
  );
};

export default Skeleton;
