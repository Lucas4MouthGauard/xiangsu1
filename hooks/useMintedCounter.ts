import { useEffect, useRef, useState } from 'react';

export function useMintedCounter(initial = 3000) {
  const startedRef = useRef<number>(Date.now());
  const [minted, setMinted] = useState(initial);
  useEffect(() => {
    const update = () => {
      const elapsed = Date.now() - startedRef.current;
      setMinted(initial + Math.floor(elapsed / 900));
    };
    update();
    const id = setInterval(update, 900);
    return () => clearInterval(id);
  }, [initial]);
  return minted;
}