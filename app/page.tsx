import Image from 'next/image'
import styles from './page.module.css'
import CardContainer from './components/cardContainer/cardContainer'
import AboutCard from './components/aboutCard/aboutCard'

export default function Home() {
  return (
    <main className={styles.main}>

      <div className={styles.navBarContainer} >
        <div className={styles.navBar} />
      </div>

      <div className={styles.pageSection}>
        <div className={styles.homeContent}>

          <div className={styles.nameTag}>
            <h1>fudgeu</h1>
          </div>

          <div className={styles.nameTagSubtext}>
            <h3>aka <b>patrick koss</b> &bull; aspiring web and game developer</h3>
          </div>

        </div>
      </div>

      <div className={styles.splitPageSection}>
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

      <div className={styles.pageSection}>
        <div className={styles.projectsContent}>
          <h2>projects</h2>
          <p>project 1 2 and 3</p>
        </div>
      </div>

      <div className={styles.pageSection}>
        <div className={styles.contactContent}>
          <h2>contact</h2>
          <p>do not</p>
        </div>
      </div>

    </main>
  )
}
