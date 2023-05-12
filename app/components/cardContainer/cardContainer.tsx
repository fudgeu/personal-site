'use client'

import Image from 'next/image';
import styles from './style.module.css'
import { useRef } from 'react';

type CardContainerProps = {
  children: React.ReactNode
}

const arrowSize = 35;

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
				<button className={styles.scrollButton} onClick={() => scroll(-10)}>
					<Image src="/arrow_back.svg" width={arrowSize} height={arrowSize} alt="Scroll back" />
				</button>
				<button className={styles.scrollButton} onClick={() => scroll(10)}>
					<Image src="/arrow_forward.svg" width={arrowSize} height={arrowSize} alt="Scroll forward" />
				</button>
			</div>
    </div>
  )
}