import { type ReactNode } from 'react';
import { PHONE } from '../../utils/constants';

interface PhoneScreenProps {
  children: ReactNode;
}

export function PhoneScreen({ children }: PhoneScreenProps) {
  return (
    <div
      className="absolute inset-0 overflow-hidden bg-black"
      style={{
        borderRadius: PHONE.screenRadius,
      }}
    >
      {children}
    </div>
  );
}
