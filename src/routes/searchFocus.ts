import { createContext, useContext } from "react";

/** Lets a page ask the sidebar's location search to take focus, such as the empty state's button. */
export const FocusSearchContext = createContext<() => void>(() => {});

export function useFocusSearch(): () => void {
  return useContext(FocusSearchContext);
}
