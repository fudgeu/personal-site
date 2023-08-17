import styles from './styles.module.css';

type AboutArticleProps = {
  children: React.ReactNode;
};

export default function AboutArticle({ children }: AboutArticleProps) {
  return (
    <article className={styles.aboutArticle}>
      {children}
    </article>
  );
}
