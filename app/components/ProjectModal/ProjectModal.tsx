import LinkButton from '../LinkButton/LinkButton';
import styles from './style.module.css'

type ProjectModalProps = {
	onClose: () => void;
}

export default function ProjectModal({ onClose }: ProjectModalProps) {
	return (
		<div className={styles.projectModalContainer}>
			<div className={styles.projectModal}>
				<h3>Test</h3>
				<LinkButton label="" img="/close.svg" onClick={onClose} />
			</div>
		</div>
	)
}