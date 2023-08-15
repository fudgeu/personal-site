'use client';

import Image from 'next/image';
import styles from './style.module.css';

type LinkButtonProps = {
  label: string,
  img: string,
  alt: string,
  onClick: () => void
};

export default function LinkButton({
  label, img, alt, onClick,
}: LinkButtonProps) {
  return (
    <button type="button" className={styles.linkButton} onClick={onClick}>
      {img !== '' && (<Image className={styles.linkButtonImg} src={img} width={25} height={25} alt={alt} />)}
      {label !== '' && (<p>{label}</p>)}
    </button>
  );
}
