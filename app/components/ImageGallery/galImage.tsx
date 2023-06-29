/* eslint-disable @next/next/no-img-element */
import styles from './style.module.css';

type GalImageProps = {
  src: string,
  alt: string
};

export default function GalImage({ src, alt }: GalImageProps) {
  return (
    <img className={styles.galImage} alt={alt} src={src} />
  );
}
