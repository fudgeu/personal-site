import styles from './style.module.css';

type ButtonProps = {
  label: string,
  onClick: () => void
};

export default function SmallButton({ label, onClick }: ButtonProps) {
  return (
    <button className={styles.button} type="button" onClick={onClick}>
      {label}
    </button>
  );
}
