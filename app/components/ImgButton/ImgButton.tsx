/* eslint-disable @next/next/no-img-element */
import styles from './style.module.css';

type ImgButtonProps = {
  src: string,
  alt: string,
  onClick: () => void
};

export default function ImgButton({ src, alt, onClick }: ImgButtonProps) {
  return (
    <button className={styles.imgButton} type="button" onClick={onClick}>
      <img src={src} alt={alt} />
    </button>
  );
}
