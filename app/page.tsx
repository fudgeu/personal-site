import Image from 'next/image'
import styles from './page.module.css'

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

      <div className={styles.pageSection}>
        <div className={styles.aboutContent}>
          <h2>about</h2>
          <p>blah blah blah blah</p>
        </div>
      </div>

    </main>
  )
}
