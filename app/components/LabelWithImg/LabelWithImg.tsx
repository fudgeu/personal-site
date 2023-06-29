/* eslint-disable @next/next/no-img-element */
import styles from './style.module.css';

type LabelWithImgProps = {
  img: string,
  imgAlt: string,
  children: React.ReactNode
};

export default function LabelWithImg({ img, imgAlt, children }: LabelWithImgProps) {
  return (
    <div className={styles.container}>
      <img className={styles.labelImg} src={img} alt={imgAlt} />
      {children}
    </div>
  );
}
