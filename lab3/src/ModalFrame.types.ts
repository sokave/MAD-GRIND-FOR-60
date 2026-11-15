import type { ReactNode } from 'react';

export type ModalFrameProps = {
  title: string;
  onClose: () => void;
  sheet?: boolean;
  children: ReactNode;
};
