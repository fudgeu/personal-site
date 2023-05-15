import styles from './style.module.css'
import Image from 'next/image'

type LinkButtonProps = {
	label: string,
	img: string,
	onClick: () => void
}

export default function LinkButton({ label, img, onClick }: LinkButtonProps) {
	return (
		<button className={styles.linkButton} onClick={onClick}>
			<Image className={styles.linkButtonImg} src={img} width={25} height={25} alt={label} />
			{label != "" && (<p>{label}</p>)}
		</button>
	)
}