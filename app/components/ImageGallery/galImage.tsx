import styles from './style.module.css'

type GalImageProps = {
	src: string
}

export default function GalImage({ src }: GalImageProps) {
	return (
		<img className={styles.galImage} src={src} />
	)
}