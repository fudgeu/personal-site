import GalImage from '../ImageGallery/galImage';
import ImageGallery from '../ImageGallery/imageGallery';
import LinkButton from '../LinkButton/LinkButton';
import styles from './style.module.css'

type ProjectModalProps = {
	onClose: () => void;
}

export default function ProjectModal({ onClose }: ProjectModalProps) {
	return (
		<div className={styles.projectModalContainer}>
			<div className={styles.projectModal}>
				<div className={styles.prjMdlTopBar}>
					<h3>Playlist</h3>
					<LinkButton label="" img="/close.svg" onClick={onClose} />
				</div>
				<ImageGallery>
					<GalImage src="https://i.imgur.com/7ZOgVEB.jpeg" />
					<GalImage src="https://i.imgur.com/7ZOgVEB.jpeg" />
					<GalImage src="https://i.imgur.com/7ZOgVEB.jpeg" />
				</ImageGallery>
				<p>a Minecraft mod rewriting the in-game music system, allowing for complete control over what and how music plays</p>
				<h3>written using:</h3>
				<p>- java</p>
				<p>- fabric toolchain</p>
				<div className={styles.prjMdlButtons}>
					<LinkButton label="Modrinth" img="https://docs.modrinth.com/img/logo.svg" onClick={() => {}} />
					<LinkButton label="Curseforge" img="https://docs.modrinth.com/img/logo.svg" onClick={() => {}} />
					<LinkButton label="GitHub" img="https://docs.modrinth.com/img/logo.svg" onClick={() => {}} />
				</div>
			</div>
		</div>
	)
}