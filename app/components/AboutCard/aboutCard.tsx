'use client'

import { useRef } from 'react'
import styles from './style.module.css'
import clsx from 'clsx'
import { useInView } from 'react-intersection-observer'

type AboutCardProps = {
  children: React.ReactNode
}

const inViewOptions = {
	root: null,
	rootMargin: "0px",
	threshold: 0.75
}

export default function AboutCard({ children }: AboutCardProps) {

	const { ref, inView } = useInView(inViewOptions)
	
	return (
		<div 
			className={clsx({
				[styles.aboutCard]: true,
				[styles.aboutCardActive]: inView
			})} 
			ref={ref}
		>
			{children}
		</div>
	)
}