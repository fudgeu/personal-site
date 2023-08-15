/* eslint-disable @next/next/no-img-element */
import LinkButton from '../LinkButton/LinkButton';
import styles from './style.module.css';

type ProjectCardProps = {
  logo: string,
  logoAltText: string,
  openModal: () => void,
  children: React.ReactNode,
};

export default function ProjectCard(
  {
    logo,
    logoAltText,
    openModal,
    children,
  }: ProjectCardProps,
) {
  return (
    <article className={styles.projectCard}>
      <img className={styles.logo} src={logo} alt={logoAltText} />
      <p>
        {children}
      </p>
      <div className={styles.seeMoreButton}>
        <LinkButton label="More info" img="/expand.svg" alt='' onClick={openModal} />
      </div>
    </article>
  );
}
