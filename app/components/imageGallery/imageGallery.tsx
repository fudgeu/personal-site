// Mostly based off of the CardContainer
import styles from './style.module.css'

type ImageGalleryProps = {
  children: React.ReactNode
}

export default function ImageGallery({ children }: ImageGalleryProps) {
	return (
		<div className={styles.imageGalleryContainer}>

			<div className={styles.imageGallery}>
				{children}
			</div>

			<div className={styles.imageGalleryButtons}>

			</div>

		</div>
	)
}