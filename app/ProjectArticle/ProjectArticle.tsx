/* eslint-disable @next/next/no-img-element */
import clsx from 'clsx';
import styles from './styles.module.css';
import Button from '../components/Button/Button';

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
        <img src={logoSrc} alt="" />
        {children}
        <Button label="see more" onClick={() => {}} />
      </div>
      <div className={styles.thumbnail}>
        <img src={thumbnailSrc} alt={thumbnailAlt} />
      </div>
    </article>
  );
}
