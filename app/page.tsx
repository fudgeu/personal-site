/* eslint-disable @next/next/no-img-element */
'use client'

import styles from './page.module.css'
import CardContainer from './components/CardContainer/cardContainer'
import AboutCard from './components/AboutCard/aboutCard'
import NavBar from './components/navbar/navbar'
import { useInView } from 'react-intersection-observer'
import ProjectCard from './components/ProjectCard/projectCard'
import LinkButton from './components/LinkButton/LinkButton'
import ProjectModal, { Sources } from './components/ProjectModal/ProjectModal'
import { useEffect, useRef, useState } from 'react'
import useTransition from 'react-transition-state'
import transitionStyle from './util/TransitionStyleMap'
import LabelWithImg from './components/LabelWithImg/LabelWithImg'
import GLView from './components/GLView/GLView'


const inViewOptions = {
	root: null,
	rootMargin: "0px",
	threshold: 0.51
}

enum Modals {
	None,
	Playlist,
	Classabull
}

export default function Home() {

	const [currentModal, setCurrentModal] = useState(Modals.None)
	const [showNavBar, setShowNavBar] = useState(true)
	const [scrollPosition, setScrollPosition] = useState(0)
	const { ref: homeRef, inView: homeInView } = useInView(inViewOptions)
	const { ref: aboutRef, inView: aboutInView } = useInView(inViewOptions)
	const { ref: projectsRef, inView: projectsInView } = useInView(inViewOptions)
	const { ref: contactRef, inView: contactInView } = useInView(inViewOptions)

	const [{status}, toggle] = useTransition({
		timeout: 200,
		preEnter: true,
	})

	useEffect(() => toggle(true), [toggle])

	const mainRef = useRef<HTMLDivElement>() as React.MutableRefObject<HTMLDivElement>

	// Handle scroll
	const handleScroll = () => {
		const position = mainRef.current.scrollTop;
		setScrollPosition(position);
	};

	useEffect(() => {
		mainRef.current.addEventListener('scroll', handleScroll, { passive: true });

		const currentRef = mainRef.current;

		return () => {
				currentRef.removeEventListener('scroll', handleScroll);
		};
	}, []);

	const toggleModal = (newState: boolean, modal: Modals) => {
		if (newState) {
			toggle(false)
			setShowNavBar(false)
			setTimeout(() => setCurrentModal(modal), 1)
		} else {
			setCurrentModal(modal)
			setTimeout(() => {
				toggle(true)
				setShowNavBar(true)
			}, 1)
		}
	}

  return (
    <main className={styles.main} ref={mainRef}>
			<GLView scrollPosition={scrollPosition} />

      <div id="home" className={styles.pageSection} ref={homeRef}>
        <div className={styles.homeContent}>

          <div className={styles.nameTag}>
            <h1>fudgeu</h1>
          </div>

          <div className={styles.nameTagSubtext}>
            <h3>aka <b>patrick koss</b> &bull; aspiring web and game developer</h3>
          </div>

        </div>

      </div>

      <div id="about" className={styles.splitPageSection} ref={aboutRef}>
        <div className={styles.aboutContent}>

          <div className={styles.splitSection} >
            <h2>about me</h2>
          </div>

          <CardContainer>

            <AboutCard>
              <h3><b>welcome!</b></h3>
              <p>lorem ipsum dolor blah blah blah lsdfsd jmowk wvke</p>
            </AboutCard>  

            <AboutCard>
              <h3><b>interests</b></h3>
              <p>banana shooter and rtoblox</p>
            </AboutCard>
            

            <AboutCard>
              <h3><b>my stack</b></h3>
              <p>- react</p>
              <p>- next.js</p>
            </AboutCard>

            <AboutCard>
              <h3><b>favorite things</b></h3>
              <p>bread bread breaaad bred bead bread bread</p>
            </AboutCard>

          </CardContainer>

        </div>
      </div>

			<div id="projects" className={styles.splitPageSection} ref={projectsRef}>
        <div className={transitionStyle(styles, 'projectsContent', status)}>

					<div className={styles.splitSection}>
						<h2>projects</h2>
					</div>
          
					<CardContainer>

						<ProjectCard>
							<h3><b>Playlist</b></h3>
							<img className={styles.prjCardImg} src="/sampleScreenshot.jpeg" alt="Screenshot" />
							<p>a Minecraft mod rewriting the in-game music system, allowing for complete control over what and how music plays</p>
							<LinkButton label="See more" img="/expand.svg" onClick={() => {toggleModal(true, Modals.Classabull)}} />

						</ProjectCard>

						<ProjectCard>
							<img className={styles.prjCardLogo} src="https://i.imgur.com/AtCmxQF.png" alt="Playlist logo" />
							<img className={styles.prjCardImg} src="/sampleScreenshot.jpeg" alt="Screenshot" />
							<p>a Minecraft mod rewriting the in-game music system, allowing for complete control over what and how music plays</p>
							<LinkButton label="See more" img="/expand.svg" onClick={() => {toggleModal(true, Modals.Playlist)}} />
						</ProjectCard>
					
						<ProjectCard>
							<h3><b>Classabull</b></h3>
							<img className={styles.prjCardImg} src="/sampleScreenshot.jpeg" alt="Screenshot" />
							<p>a Minecraft mod rewriting the in-game music system, allowing for complete control over what and how music plays</p>
							<LinkButton label="Modrinth" img="https://docs.modrinth.com/img/logo.svg" onClick={() => {}} />
						</ProjectCard>

						<ProjectCard>
							<h3><b>this website!</b></h3>
							<img className={styles.prjCardImg} src="/sampleScreenshot.jpeg" alt="Screenshot" />
							<p>a Minecraft mod rewriting the in-game music system, allowing for complete control over what and how music plays</p>
							<LinkButton label="Modrinth" img="https://docs.modrinth.com/img/logo.svg" onClick={() => {}} />
						</ProjectCard>

          </CardContainer>

        </div>
      </div>

      <div id="contact" className={styles.pageSection} ref={contactRef}>
        <div className={styles.contactContent}>
          <h2>contact</h2>
          <p>you can reach out to me regarding just about anything - from requests to just wanting to talk! do keep in mind that i&apos;ll likely respond quicker via discord however :&#41;</p>
					<LabelWithImg img="/email.svg" imgAlt="Email icon">patrickkoss@outlook.com</LabelWithImg>
					<LabelWithImg img="/discord-mark.svg" imgAlt="Discord icon">Fudgeu#6969</LabelWithImg>
				</div>
      </div>

			<NavBar
				show={showNavBar}
				homeInView={homeInView}
				aboutInView={aboutInView}
				projectsInView={projectsInView}
				contactInView={contactInView}
			/>

			<ProjectModal
				isOpen={currentModal == Modals.Playlist}
				onClose={() => toggleModal(false, Modals.None)}
				logo="https://i.imgur.com/AtCmxQF.png"
				images={["https://i.imgur.com/7ZOgVEB.jpeg", "https://i.imgur.com/7ZOgVEB.jpeg" ,"https://i.imgur.com/7ZOgVEB.jpeg"]}
				buttons={[
					{source: Sources.modrinth, link: ""},
					{source: Sources.curseforge, link: ""},
					{source: Sources.github, link: ""}
				]}
			>
				<p>a Minecraft mod rewriting the in-game music system, allowing for complete control over what and how music plays</p>
				<p>written using:</p>
				<p>- java</p>
				<p>- fabric toolchain</p>
			</ProjectModal>

			<ProjectModal
				isOpen={currentModal == Modals.Classabull}
				onClose={() => toggleModal(false, Modals.None)}
				logo="https://i.imgur.com/AtCmxQF.png"
				images={["https://i.imgur.com/7ZOgVEB.jpeg", "https://i.imgur.com/7ZOgVEB.jpeg" ,"https://i.imgur.com/7ZOgVEB.jpeg"]}
				buttons={[
					{source: Sources.github, link: ""}
				]}
			>
				<p>test</p>
			</ProjectModal>

    </main>
  )
}
