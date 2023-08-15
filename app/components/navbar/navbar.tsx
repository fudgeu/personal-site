import { useEffect } from 'react';
import useTransition from 'react-transition-state';
import transitionStyle from '@/app/util/TransitionStyleMap';
import NavBarItem from './navbarItem/navbarItem';
import styles from './style.module.css';

type NavBarProps = {
  show: boolean,
  homeInView: boolean,
  aboutInView: boolean,
  projectsInView: boolean,
  contactInView: boolean
};

export default function NavBar(
  {
    show, homeInView, aboutInView, projectsInView, contactInView,
  }: NavBarProps,
) {
  const [{ status }, trigger] = useTransition({
    timeout: 200,
    preEnter: true,
    mountOnEnter: true,
  });

  useEffect(() => trigger(show), [show]);

  const isActiveSection = (id: string): boolean => {
    switch (id) {
      case 'home':
        return homeInView;
      case 'about':
        return aboutInView;
      case 'projects':
        return projectsInView;
      case 'contact':
        return contactInView;
      default:
        return false;
    }
  };

  return (
    <nav className={transitionStyle(styles, 'navBarContainer', status)}>
      <ul className={styles.navBar}>
        <li><NavBarItem id="home" altName="Home" isActive={isActiveSection} /></li>
        <li><NavBarItem id="about" altName="About" isActive={isActiveSection} /></li>
        <li><NavBarItem id="projects" altName="Projects" isActive={isActiveSection} /></li>
        <li><NavBarItem id="contact" altName="Contact" isActive={isActiveSection} /></li>
      </ul>
    </nav>
  );
}
