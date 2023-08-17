import styles from './styles.module.css';

type BulletsProps = {
  children: React.ReactNode
};

export default function AdaptableBullets({ children }: BulletsProps) {
  return (
    <ul className={styles.list}>
      {children}
    </ul>
  );
}
