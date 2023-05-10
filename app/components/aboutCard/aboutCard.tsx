'use client'

import { useRef } from 'react'
import styles from './style.module.css'
import useOnScreen from '@/app/hooks/useOnScreen'
import clsx from 'clsx'

type AboutCardProps = {
  children: React.ReactNode
}

export default function AboutCard({ children }: AboutCardProps) {

	const ref = useRef<HTMLDivElement>(null)
  const isVisible = useOnScreen(ref)
	
	return (
		<div 
			className={clsx({
				[styles.aboutCard]: true,
				[styles.aboutCardActive]: isVisible
			})} 
			ref={ref}
		>
			{children}
		</div>
	)
}