'use client'

import styles from './page.module.css'
import CardContainer from './components/cardContainer/cardContainer'
import AboutCard from './components/aboutCard/aboutCard'
import NavBar from './components/navbar/navbar'
import { useInView } from 'react-intersection-observer'

const inViewOptions = {
	root: null,
	rootMargin: "0px",
	threshold: 0.51
}

export default function Home() {

	const { ref: homeRef, inView: homeInView } = useInView(inViewOptions)
	const { ref: aboutRef, inView: aboutInView } = useInView(inViewOptions)
	const { ref: projectsRef, inView: projectsInView } = useInView(inViewOptions)
	const { ref: contactRef, inView: contactInView } = useInView(inViewOptions)

  return (
    <main className={styles.main}>

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

      <div id="projects" className={styles.pageSection} ref={projectsRef}>
        <div className={styles.projectsContent}>
          <h2>projects</h2>
          <p>project 1 2 and 3</p>
        </div>
      </div>

      <div id="contact" className={styles.pageSection} ref={contactRef}>
        <div className={styles.contactContent}>
          <h2>contact</h2>
          <p>do not</p>
        </div>
      </div>

			<NavBar 
				homeInView={homeInView}
				aboutInView={aboutInView}
				projectsInView={projectsInView}
				contactInView={contactInView}
			/>

    </main>
  )
}
