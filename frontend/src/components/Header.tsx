import type { ReactNode } from 'react';
import headerDrip from '../assets/header_drip.svg';

interface HeaderProps {
  leftChild?: ReactNode;
  rightChild?: ReactNode;
}

export default function Header({ leftChild, rightChild }: HeaderProps) {
  return (
    <>
      <header className="h-10 bg-secondary-500 flex justify-between">
        {leftChild}
        {rightChild}
      </header>
      <img src={headerDrip} />
    </>
  );
}
