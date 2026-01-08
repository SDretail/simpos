import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useWindowSize } from '../../hooks/use-window-size';

import {
  preferenceRepository,
  Preference,
} from '../../services/db/preference';
import { setBaseUrl } from '../../services/clients/api';

export interface PreferenceContextState {
  isOnline: boolean;
  isMobile: boolean;
  odooUrl: string;
  updateOdooUrl: (url: string) => Promise<void>;
}

const PreferenceContext = createContext<PreferenceContextState | undefined>(
  undefined,
);

export const PreferenceProvider: React.FunctionComponent<PropsWithChildren> = ({ children }) => {
  const [isOnline, setIsOnline] = useState(true);
  const [odooUrl, setOdooUrl] = useState<string>('');

  const { width } = useWindowSize();
  const isMobile = useMemo(() => width <= 768, [width]);
  useEffect(() => {
    function changeStatus() {
      setIsOnline(navigator.onLine);
    }
    window.addEventListener('online', changeStatus);
    window.addEventListener('offline', changeStatus);
    return () => {
      window.removeEventListener('online', changeStatus);
      window.removeEventListener('offline', changeStatus);
    };
  }, []);

  useEffect(() => {
    preferenceRepository.get().then((pref) => {
      if (pref?.odooUrl) {
        setOdooUrl(pref.odooUrl);
        setBaseUrl(pref.odooUrl);
      }
    });
  }, []);

  const updateOdooUrl = async (url: string) => {
    await preferenceRepository.update({ odooUrl: url });
    setBaseUrl(url);
    setOdooUrl(url);
  };

  return (
    <PreferenceContext.Provider
      value={{ isOnline, isMobile, odooUrl, updateOdooUrl }}
    >
      {children}
    </PreferenceContext.Provider>
  );
};

export function usePreference() {
  return useContext(PreferenceContext)!;
}
