/* eslint-disable @next/next/no-img-element */

'use client';

import { useEffect } from 'react';
import useTransition from 'react-transition-state';
import transitionStyle from '@/app/util/TransitionStyleMap';
import GalImage from '../ImageGallery/galImage';
import ImageGallery from '../ImageGallery/imageGallery';
import LinkButton from '../LinkButton/LinkButton';
import styles from './style.module.css';

type Source = {
  img: string,
  label: string,
};

export const Sources = {
  github: { img: './github-logo.svg', label: 'Github' },
  modrinth: { img: './modrinth-logo.svg', label: 'Modrinth' },
  curseforge: { img: './curseforge-logo.svg', label: 'Curseforge' },
  website: { img: './open-new-tab.svg', label: 'Visit' },
};

type Button = {
  source: Source
  link: string
};

type ProjectModalProps = {
  isOpen: boolean,
  onClose: () => void,
  logo: string,
  images: string[],
  alts: string[],
  buttons: Button[],
  children: React.ReactNode
};

export default function ProjectModal(
  {
    isOpen, onClose, logo, images, alts, buttons, children,
  }: ProjectModalProps,
) {
  const [{ status }, toggle] = useTransition({
    timeout: 200,
    preEnter: true,
  });

  useEffect(() => toggle(isOpen), [isOpen]);

  return (
    <div className={transitionStyle(styles, 'container', status)}>
      <div className={styles.mobileScrollContainer}>
        <div className={transitionStyle(styles, 'projectModal', status)}>

          <div className={styles.topBar}>
            <img className={styles.logo} src={logo} alt="Playlist logo" />
            <LinkButton label="" img="/close.svg" onClick={onClose} />
          </div>

          <ImageGallery>
            {images.map((image, index) => <GalImage key={image} src={image} alt={alts[index]} />)}
          </ImageGallery>

          <div className={styles.description}>
            {children}
          </div>

          <div className={styles.buttons}>
            {buttons.map((button) => (
              <LinkButton
                key={button.link}
                label={button.source.label}
                img={button.source.img}
                onClick={() => { window.open(button.link, '_blank', 'noreferrer'); }}
              />
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
