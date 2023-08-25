/* eslint-disable @next/next/no-img-element */
import clsx from 'clsx';
import styles from './styles.module.css';
import Button from '../components/Button/Button';
import SmallButton from '../components/SmallButton/SmallButton';

export enum Alignment {
  LEFT,
  RIGHT,
}

type ProjectProps = {
  logoSrc: string,
  thumbnailSrc: string,
  thumbnailAlt: string,
  alignment: Alignment,
  children: React.ReactNode
};

export default function ProjectArticle({
  logoSrc, thumbnailSrc, thumbnailAlt, alignment, children,
}: ProjectProps) {
  return (
    <article
      className={
        clsx({
          [styles.articleLeftAligned]: alignment === Alignment.LEFT,
          [styles.articleRightAligned]: alignment === Alignment.RIGHT,
        })
      }
    >
      <div className={styles.description}>
        <img className={styles.logo} src={logoSrc} alt="" />
        {children}
        <div>
          <SmallButton label="see more" onClick={() => {}} />
        </div>
      </div>
      <div className={styles.thumbnail}>
        <img src={thumbnailSrc} alt={thumbnailAlt} />
      </div>
    </article>
  );
}
