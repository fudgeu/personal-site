import Image from 'next/image';
import clsx from 'clsx';
import styles from './style.module.css';

type NavBarItemProps = {
  id: string,
  altName: string,
  isActive: (id: string) => boolean,
};

const iconSize = 35;

export default function NavBarItem({ id, altName, isActive }: NavBarItemProps) {
  return (
    <a href={`/#${id}`} className={styles.navItemContainer}>
      <Image
        className={
          clsx({
            [styles.navItem]: true,
            [styles.selectedNavItem]: isActive(id),
          })
        }
        src={`${id}.svg`}
        width={iconSize}
        height={iconSize}
        alt={altName}
      />
    </a>
  );
}
