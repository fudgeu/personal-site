'use client'

import { useEffect, useRef } from 'react';
import GalImage from '../ImageGallery/galImage';
import ImageGallery from '../ImageGallery/imageGallery';
import LinkButton from '../LinkButton/LinkButton';
import styles from './style.module.css'
import useTransition from 'react-transition-state';
import transitionStyle from '@/app/util/TransitionStyleMap';

type ProjectModalProps = {
	isOpen: boolean;
	onClose: () => void;
}

export default function ProjectModal({ isOpen, onClose }: ProjectModalProps) {
	const [{status, isMounted}, toggle] = useTransition({
		timeout: 200,
		preEnter: true,
	})

	useEffect(() => toggle(isOpen), [isOpen])

	//if (!isMounted) return null;

	return (
		<div className={transitionStyle(styles, 'container', status)}>
			<div className={transitionStyle(styles, 'projectModal', status)}>

				<div className={styles.topBar}>
					<h2>Playlist</h2>
					<LinkButton label="" img="/close.svg" onClick={onClose} />
				</div>
				
				<ImageGallery>
					<GalImage src="https://i.imgur.com/7ZOgVEB.jpeg" />
					<GalImage src="https://i.imgur.com/7ZOgVEB.jpeg" />
					<GalImage src="https://i.imgur.com/7ZOgVEB.jpeg" />
				</ImageGallery>

				<div className={styles.description}>
					<p>a Minecraft mod rewriting the in-game music system, allowing for complete control over what and how music plays</p>
					<p>written using:</p>
					<p>- java</p>
					<p>- fabric toolchain</p>
				</div>
	
				<div className={styles.buttons}>
					<LinkButton label="Modrinth" img="https://docs.modrinth.com/img/logo.svg" onClick={() => {}} />
					<LinkButton label="Curseforge" img="https://docs.modrinth.com/img/logo.svg" onClick={() => {}} />
					<LinkButton label="GitHub" img="https://docs.modrinth.com/img/logo.svg" onClick={() => {}} />
				</div>

			</div>
		</div>
	) 
}