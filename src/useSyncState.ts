import { useCallback, useEffect, useState } from "react";

export default function useSyncState<T>(
  initialValue: T | (() => T),
  localStorageKey: string,
): [value: T, setValue: (value: T | ((prevState: T) => T)) => void] {
  const [value, setValue] = useState<T>(initialValue);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const item = localStorage.getItem(localStorageKey);
      if (item === null) {
        return;
      }
      try {
        const itemJson = JSON.parse(item);
        setValue(itemJson);
      } catch (e) {
        console.error("error: ", e);
      }
    }, 100);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const wrappedSetValue = useCallback(
    (newStateOrFunction: T | ((prevState: T) => T)) => {
      if (typeof newStateOrFunction === "function") {
        const f = newStateOrFunction as (prevState: T) => T;
        setValue((prev) => {
          const newVal = f(prev);
          localStorage.setItem(localStorageKey, JSON.stringify(newVal));
          return newVal;
        });
      } else {
        setValue(newStateOrFunction);
        localStorage.setItem(
          localStorageKey,
          JSON.stringify(newStateOrFunction),
        );
      }
    },
    [],
  );

  return [value, wrappedSetValue];
}
