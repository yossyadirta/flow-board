"use client";

import { useIsFetching, useIsMutating } from "@tanstack/react-query";

export const useAppState = () => {
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();

  return {
    state: {
      isFetching: isFetching > 0,
      isMutating: isMutating > 0,
      boards: {},
      tasks: {},
    },
    dispatch: () => {},
  };
};
