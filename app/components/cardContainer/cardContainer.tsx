'use client'

import { useDraggable } from 'react-use-draggable-scroll';
import styles from './style.module.css'
import { useRef } from 'react';

type CardContainerProps = {
  children: React.ReactNode
}

export default function CardContainer({ children }: CardContainerProps) {
	const ref = useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>;
	//const { events } = useDraggable(ref);
	
	const scroll = (amt: number) => {
		ref.current.scrollBy({
			top: 0,
			left: amt,
			behavior: "smooth"
		})
	}

  return (
    <div className={styles.cardContainer}>
			<div className={styles.cards} ref={ref}>
				{children}
			</div>
			<div className={styles.scrollButtons}>
				<div onClick={() => scroll(-10)}>&lt;-</div>
				<div onClick={() => scroll(10)}>-&gt;</div>
			</div>
    </div>
  )
}