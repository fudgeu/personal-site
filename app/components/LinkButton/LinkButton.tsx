'use client';

import Image from 'next/image';
import clsx from 'clsx';
import styles from './style.module.css';

type LinkButtonProps = {
  label: string,
  img: string,
  alt: string,
  isHyperlink?: boolean,
  onClick: () => void
};

export default function LinkButton({
  label, img, alt, isHyperlink, onClick,
}: LinkButtonProps) {
  return (
    <button type="button" className={clsx({ [styles.linkButton]: true, [styles.hyperlink]: isHyperlink })} onClick={onClick}>
      {img !== '' && (<Image className={styles.linkButtonImg} src={img} width={25} height={25} alt={alt} />)}
      {label !== '' && (<p>{label}</p>)}
    </button>
  );
}

LinkButton.defaultProps = {
  isHyperlink: false,
};
