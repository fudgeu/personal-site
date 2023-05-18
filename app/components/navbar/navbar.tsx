import clsx from 'clsx'
import styles from './style.module.css'
import NavBarItem from './navbarItem/navbarItem'
import useTransition from 'react-transition-state'
import { useEffect } from 'react'
import transitionStyle from '@/app/util/TransitionStyleMap'

type NavBarProps = {
	show: boolean,
	homeInView: boolean,
	aboutInView: boolean,
	projectsInView: boolean,
	contactInView: boolean
}

const iconSize = 35

export default function NavBar({ show, homeInView, aboutInView, projectsInView, contactInView }: NavBarProps) {

	const [{status}, trigger] = useTransition({
		timeout: 200,
		preEnter: true,
		mountOnEnter: true,
	})

	useEffect(() => trigger(show), [show])

	const isActiveSection = (id: string): boolean => {
		switch (id) {
			case "home":
				return homeInView
			case "about":
				return aboutInView
			case "projects":
				return projectsInView
			case "contact":
				return contactInView
			default:
				return false
		}
	}

	return (
		<div className={transitionStyle(styles, 'navBarContainer', status)}>
      <div className={styles.navBar}>
				<NavBarItem id="home" altName="Home" isActive={isActiveSection} />
				<NavBarItem id="about" altName="About" isActive={isActiveSection} />
				<NavBarItem id="projects" altName="Projects" isActive={isActiveSection} />
				<NavBarItem id="contact" altName="Contact" isActive={isActiveSection} />
			</div>
    </div>
	)
}