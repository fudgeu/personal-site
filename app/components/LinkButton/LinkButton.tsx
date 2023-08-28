'use client';

import Image from 'next/image';
import clsx from 'clsx';
import styles from './style.module.css';

type LinkButtonProps = {
  label: string,
  img: string,
  alt: string,
  url: string,
};

export default function LinkButton({
  label, img, alt, url,
}: LinkButtonProps) {
  return (
    <a href={url}>
      <button className={styles.linkButton} type="button">
        {img !== '' && (<Image className={styles.linkButtonImg} src={img} width={25} height={25} alt={alt} />)}
        <p>{label}</p>
      </button>
    </a>
  );
}
