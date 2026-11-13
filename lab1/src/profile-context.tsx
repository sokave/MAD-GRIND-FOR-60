import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initialProfile } from './data';

export type Profile = typeof initialProfile;
const Context = createContext<{ profile: Profile; ready: boolean; save: (next: Profile) => Promise<void> } | null>(null);
const KEY = 'lab1.profile.v1';
export function ProfileProvider({ children }: React.PropsWithChildren) {
  const [profile, setProfile] = useState(initialProfile);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    AsyncStorage.getItem(KEY).then(value => {
      if (!value) return;
      const p = JSON.parse(value);
      if (typeof p.name === 'string' && typeof p.email === 'string' && typeof p.group === 'string' && typeof p.notifications === 'boolean') setProfile(p);
    }).catch(() => {}).finally(() => setReady(true));
  }, []);
  async function save(next: Profile) {
    await AsyncStorage.setItem(KEY, JSON.stringify(next));
    setProfile(next);
  }
  return <Context.Provider value={{ profile, ready, save }}>{children}</Context.Provider>;
}
export function useProfile() {
  const value = useContext(Context);
  if (!value) throw new Error('ProfileProvider is missing');
  return value;
}
