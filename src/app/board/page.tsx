"use client";

import React from "react";

type Props = {
  children: React.ReactNode;
};

const Page = ({ children }: Props) => {
  return <div className="flex gap-2">{children}</div>;
};

export default Page;
