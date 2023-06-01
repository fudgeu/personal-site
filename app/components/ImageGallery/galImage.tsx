/* eslint-disable @next/next/no-img-element */
import styles from './style.module.css'

type GalImageProps = {
	src: string
}

export default function GalImage({ src }: GalImageProps) {
	return (
		<img className={styles.galImage} src={src} />
	)
}