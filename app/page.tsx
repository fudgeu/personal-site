/* eslint-disable @next/next/no-img-element */

'use client';

import { useEffect, useRef, useState } from 'react';
import useTransition from 'react-transition-state';
import { useInView } from 'react-intersection-observer';
import styles from './page.module.css';
import NavBar from './components/navbar/navbar';
import ProjectModal, { Sources } from './components/ProjectModal/ProjectModal';
import LabelWithImg from './components/LabelWithImg/LabelWithImg';
import GLView from './components/GLView/GLView';
import Button from './components/Button/Button';
import BackgroundAmbience from './components/BackgroundAmbience/BackgroundAmbience';
import AboutArticle from './components/AboutArticle/AboutArticle';
import AdaptableBullets from './components/AdaptableBullets/AdaptableBullets';
import ProjectArticle, { Alignment } from './ProjectArticle/ProjectArticle';
import useWindowDimensions from './hooks/useWindowDimensions';

const inViewOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.51,
};

enum Modals {
  NONE,
  PLAYLIST,
  CLASSABULL,
  REFONT,
  WEBSITE,
}

export default function Home() {
  const [currentModal, setCurrentModal] = useState(Modals.NONE);
  const [showNavBar, setShowNavBar] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);
  const mainRef = useRef<HTMLDivElement>() as React.MutableRefObject<HTMLDivElement>;
  const { ref: homeRef, inView: homeInView } = useInView(inViewOptions);
  const { ref: aboutRef, inView: aboutInView } = useInView(inViewOptions);
  const { ref: projectsRef, inView: projectsInView } = useInView(inViewOptions);
  const { ref: contactRef, inView: contactInView } = useInView(inViewOptions);

  const { width, height } = useWindowDimensions();
  const [isMobile, setMobile] = useState(true);

  useEffect(() => {
    if (width <= 800) {
      setMobile(true);
      return;
    }
    setMobile(false);
  },
  [width]);

  const [{ status }, toggle] = useTransition({
    timeout: 200,
    preEnter: true,
  });

  useEffect(() => toggle(true), [toggle]);

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
      toggle(false);
      setShowNavBar(false);
      setTimeout(() => setCurrentModal(modal), 1);
    } else {
      setCurrentModal(modal);
      setTimeout(() => {
        toggle(true);
        setShowNavBar(true);
      }, 1);
    }
  };

  return (
    <main className={styles.main} ref={mainRef}>

      {!isMobile
      && (
      <GLView
        scrollPosition={scrollPosition}
        pageWidth={width}
        pageHeight={height}
      />
      )}

      <BackgroundAmbience />

      <section id="home" className={styles.section} ref={homeRef}>
        <header className={styles.homeContent}>
          <div className={styles.nameTag}>
            <h1>hi, i&apos;m <span className={styles.nameText}>fudgeu</span></h1>
          </div>
          <div className={styles.nameTagSubtext}>
            <p>
              aka <b>patrick koss</b> &bull; an aspiring web and game
              developer, i love creating software everyone can benefit from
            </p>
          </div>
          <div className={styles.resumeButtonContainer}>
            <Button label="see my resume" onClick={() => {}} />
          </div>
        </header>
      </section>

      <section id="about" className={styles.section} ref={aboutRef}>
        <div className={styles.aboutSection}>
          <h2>about</h2>
          <span className={styles.separator} />
          <div className={styles.aboutArticles}>
            <AboutArticle>
              <h3>welcome!</h3>
              <p>
                I&apos;m a current college student at UCF, studying computer science!
                I love designing great user interfaces and creating products that
                are both simple to use yet powerful. On top of that, I also love
                experimenting and seeing what can be done with code!
              </p>
            </AboutArticle>

            <AboutArticle>
              <h3>skills</h3>
              <p>I&apos;ve worked with the following languages and tools extensively:</p>
              <AdaptableBullets>
                <li>Typescript/Javascript</li>
                <li>React.JS/Next.JS</li>
                <li>Java</li>
                <li>C</li>
                <li>C#</li>
                <li>Fabric Toolchain</li>
              </AdaptableBullets>
            </AboutArticle>

            <AboutArticle>
              <h3>learning...</h3>
              <p>
                I&apos;m always eager to try new things, especially new technologies.
                Even if I personally will never use it, there is always something I can
                learn that may apply to something that I will.
              </p>
              <p>
                At the moment, I&apos;m taking my time to learn the following:
              </p>
              <AdaptableBullets>
                <li>C++</li>
                <li>OpenGL/Vulkan</li>
                <li>Rust</li>
                <li>Unity Game Engine</li>
              </AdaptableBullets>
            </AboutArticle>

            <AboutArticle>
              <h3>other interests</h3>
              <p>
                Other things I love to do in my free time include skating, traveling
                through both nature and through cities, and of course, playing some games.
                I also love photography, especially while traveling, where I can take
                photos of land and cityscapes.
              </p>
            </AboutArticle>

          </div>
        </div>
      </section>

      <section id="projects" className={styles.section} ref={projectsRef}>
        <div className={styles.projectsSection}>
          <h2>projects</h2>
          <span className={styles.separator} />
          <div className={styles.projectArticles}>

            <ProjectArticle
              logoSrc="classabull-logo.png"
              thumbnailSrc="classabull1.png"
              thumbnailAlt="Test"
              alignment={Alignment.LEFT}
              onExpand={() => toggleModal(true, Modals.CLASSABULL)}
            >
              A better way for USF students to build their class schedule
            </ProjectArticle>

            <ProjectArticle
              logoSrc="classabull-logo.png"
              thumbnailSrc="classabull1.png"
              thumbnailAlt="Test"
              alignment={Alignment.RIGHT}
              onExpand={() => toggleModal(true, Modals.CLASSABULL)}
            >
              A better way for USF students to build their class schedule
            </ProjectArticle>

            <ProjectArticle
              logoSrc="classabull-logo.png"
              thumbnailSrc="classabull1.png"
              thumbnailAlt="Test"
              alignment={Alignment.LEFT}
              onExpand={() => toggleModal(true, Modals.CLASSABULL)}
            >
              A better way for USF students to build their class schedule
            </ProjectArticle>

          </div>
        </div>
      </section>

      <section id="contact" className={styles.section} ref={contactRef}>
        <article className={styles.contactSection}>
          <h2>contact me!</h2>
          <p>
            You can reach out to me regarding just about anything - from requests to just wanting to
            talk! Do keep in mind that I&apos;ll likely respond quicker via Discord however :&#41;
          </p>
          <LabelWithImg img="/email.svg" imgAlt="Email">patrickkoss@outlook.com</LabelWithImg>
          <LabelWithImg img="/discord-mark.svg" imgAlt="Discord">fudgeu</LabelWithImg>
        </article>
      </section>

      <NavBar
        show={showNavBar}
        homeInView={homeInView}
        aboutInView={aboutInView}
        projectsInView={projectsInView}
        contactInView={contactInView}
      />

      <ProjectModal
        isOpen={currentModal === Modals.PLAYLIST}
        onClose={() => toggleModal(false, Modals.NONE)}
        logo="https://i.imgur.com/AtCmxQF.png"
        images={['./playlist1.png', './playlist2.png', './playlist3.png']}
        alts={['Main interface', 'Settings menu', 'Add songs to playlist menu']}
        buttons={[
          { source: Sources.modrinth, link: 'https://modrinth.com/mod/playlist' },
          { source: Sources.curseforge, link: 'https://www.curseforge.com/minecraft/mc-mods/playlist' },
          { source: Sources.github, link: 'https://github.com/fudgeu/playlist' },
        ]}
      >
        <p>
          A Minecraft mod rewriting the in-game music system, allowing for complete control
          over what and how music plays. Amongst the settings offered to players are the
          ability to control the time between songs, as well as the conditions under which
          song is played.
        </p>
        <br />
        <p><b>Written using:</b></p>
        <p>- Java</p>
        <p>- Fabric toolchain</p>
      </ProjectModal>

      <ProjectModal
        isOpen={currentModal === Modals.CLASSABULL}
        onClose={() => toggleModal(false, Modals.NONE)}
        logo="./classabull-logo.png"
        images={['./classabull1.png', './classabull2.png', './classabull3.png']}
        alts={[
          'Classabull interface with a filled schedule',
          'Classabull interface with an empty schedule',
          'Classabull interface with a differently filled schedule',
        ]}
        buttons={[
          { source: Sources.github, link: 'https://github.com/fudgeu/classabull' },
          { source: Sources.website, link: 'https://classabull.vercel.app/' },
        ]}
      >
        <p>
          Classabull was created during a 24-hour university hackathon -
          made with the goal of providing a better class scheduling
          experience for the students of USF. It features a sleek yet
          functional and easy to read UI, as well as a calendar to help
          visualize your week.
        </p>
        <br />
        <p><b>Written using:</b></p>
        <p>- Next.js</p>
        <p>- React.js</p>
        <p>- Javascript</p>
      </ProjectModal>

      <ProjectModal
        isOpen={currentModal === Modals.REFONT}
        onClose={() => toggleModal(false, Modals.NONE)}
        logo="./refont-logo.png"
        images={['./refont1.png', './refont2.png', './refont3.png']}
        alts={['Main page of Refont', 'Refont font selection', 'Refont settings']}
        buttons={[
          { source: Sources.github, link: 'https://github.com/fudgeu/Refont' },
        ]}
      >
        <p>
          A tool to quickly and automatically change Discord&apos;s font.
          Refont allows you to use any font installed on your computer, and
          will automatically apply it every time your computer starts. The app
          works by restarting Discord with an open debugging socket that Refont
          is able to inject CSS through.
        </p>
        <br />
        <p><b>Written using:</b></p>
        <p>- React.js</p>
        <p>- Electron</p>
        <p>- Typescript</p>
      </ProjectModal>
    </main>
  );
}
