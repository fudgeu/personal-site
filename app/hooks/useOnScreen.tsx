'use client'

import { RefObject, useEffect, useMemo, useState } from "react"

export default function useOnScreen(ref: RefObject<HTMLElement>) {

  const [isIntersecting, setIntersecting] = useState(false)

  const observer = useMemo(() => {
		const observerOptions = {
			root: null,
			rootMargin: "0px",
			threshold: 0.75
		}
		return new IntersectionObserver(
			([entry]) => setIntersecting(entry.isIntersecting),
			observerOptions
		)
	}, [])


  useEffect(() => {
		if (ref.current != null)
    	observer.observe(ref.current)
    return () => observer.disconnect()
  })

  return isIntersecting
}