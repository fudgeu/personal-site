'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import useIsOverflow from '@/app/hooks/useIsOverflow';
import styles from './style.module.css';

type CardContainerProps = {
  children: React.ReactNode
};

const arrowSize = 35;

export default function CardContainer({ children }: CardContainerProps) {
  const cardsRef = useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>;

  const [isOverflowing, setOverflowing] = useState(false);
  useIsOverflow(cardsRef, setOverflowing);

  const scroll = (amt: number) => {
    cardsRef.current.scrollBy({
      top: 0,
      left: amt,
      behavior: 'smooth',
    });
  };

  return (
    <div className={styles.cardContainer}>
      <div className={styles.cards} ref={cardsRef}>
        {children}
      </div>

      <div className={
        clsx({
          [styles.scrollButtons]: isOverflowing,
          [styles.scrollButtonsHidden]: !isOverflowing,
        })
      }
      >
        <button type="button" className={styles.scrollButton} onClick={() => scroll(-50)}>
          <Image className={styles.scrollButtonImg} src="/arrow_back.svg" width={arrowSize} height={arrowSize} alt="Scroll back" />
        </button>
        <button type="button" className={styles.scrollButton} onClick={() => scroll(50)}>
          <Image className={styles.scrollButtonImg} src="/arrow_forward.svg" width={arrowSize} height={arrowSize} alt="Scroll forward" />
        </button>
      </div>

    </div>
  );
}
