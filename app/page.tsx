/* eslint-disable @next/next/no-img-element */

'use client';

import { useEffect, useRef, useState } from 'react';
import useTransition from 'react-transition-state';
import { useInView } from 'react-intersection-observer';
import styles from './page.module.css';
import CardContainer from './components/CardContainer/cardContainer';
import AboutCard from './components/AboutCard/aboutCard';
import NavBar from './components/navbar/navbar';
import ProjectCard from './components/ProjectCard/projectCard';
import ProjectModal, { Sources } from './components/ProjectModal/ProjectModal';
import transitionStyle from './util/TransitionStyleMap';
import LabelWithImg from './components/LabelWithImg/LabelWithImg';
import GLView from './components/GLView/GLView';

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
  const { ref: homeRef, inView: homeInView } = useInView(inViewOptions);
  const { ref: aboutRef, inView: aboutInView } = useInView(inViewOptions);
  const { ref: projectsRef, inView: projectsInView } = useInView(inViewOptions);
  const { ref: contactRef, inView: contactInView } = useInView(inViewOptions);

  const [{ status }, toggle] = useTransition({
    timeout: 200,
    preEnter: true,
  });

  useEffect(() => toggle(true), [toggle]);

  const mainRef = useRef<HTMLDivElement>() as React.MutableRefObject<HTMLDivElement>;

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
      <GLView scrollPosition={scrollPosition} />

      <div id="home" className={styles.pageSection} ref={homeRef}>
        <div className={styles.homeContent}>

          <div className={styles.nameTag}>
            <h1>fudgeu</h1>
          </div>

          <div className={styles.nameTagSubtext}>
            <h3>
              aka
              {' '}
              <b>patrick koss</b>
              {' '}
              &bull; aspiring web and game developer
            </h3>
          </div>

        </div>
      </div>

      <div id="about" className={styles.splitPageSection} ref={aboutRef}>
        <div className={styles.aboutContent}>

          <div className={styles.splitSection}>
            <h2>about me</h2>
          </div>

          <CardContainer>

            <AboutCard>
              <h3><b>welcome!</b></h3>
              <p>
                I&apos;m a current college student at UCF, studying computer science!
                I love designing great user interfaces and creating products that are
                both simple to use yet powerful. On top of that, I also love experimenting
                and seeing what can be done with code!
              </p>
            </AboutCard>

            <AboutCard>
              <h3><b>stack & skills</b></h3>
              <p>- Typescript</p>
              <p>- React.js</p>
              <p>- Next.js</p>
              <p>- Java</p>
              <p>- C#</p>
              <p>- C</p>
            </AboutCard>

            <AboutCard>
              <h3><b>currently learning</b></h3>
              <p>- C++</p>
              <p>- Rust</p>
              <p>- OpenGL</p>
            </AboutCard>

            <AboutCard>
              <h3><b>other interests</b></h3>
              <p>
                I do like to game occasionally - currently finishing up Breath of the
                Wild before I move onto Tears of the Kingdom. I also love travelling to
                both cities and through nature, as well as photographing those trips!
              </p>
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

            <ProjectCard
              logo="https://i.imgur.com/AtCmxQF.png"
              logoAltText="Playlist logo"
              openModal={() => toggleModal(true, Modals.PLAYLIST)}
            >
              A Minecraft mod rewriting the in-game music system, allowing for complete control
              over what and how music plays
            </ProjectCard>

            <ProjectCard
              logo="./refont-logo.png"
              logoAltText="Refont logo"
              openModal={() => toggleModal(true, Modals.REFONT)}
            >
              A tool to quickly and automatically change Discord&apos;s font
            </ProjectCard>

            <ProjectCard
              logo="./classabull-logo.png"
              logoAltText="Classabull logo"
              openModal={() => toggleModal(true, Modals.CLASSABULL)}
            >
              A better way for USF students to build their class schedule
            </ProjectCard>

          </CardContainer>

        </div>
      </div>

      <div id="contact" className={styles.pageSection} ref={contactRef}>
        <div className={styles.contactContent}>
          <h2>contact</h2>
          <p>
            You can reach out to me regarding just about anything - from requests to just wanting to
            talk! Do keep in mind that I&apos;ll likely respond quicker via Discord however :&#41;
          </p>
          <LabelWithImg img="/email.svg" imgAlt="Email icon">patrickkoss@outlook.com</LabelWithImg>
          <LabelWithImg img="/discord-mark.svg" imgAlt="Discord icon">fudgeu</LabelWithImg>
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
        isOpen={currentModal === Modals.PLAYLIST}
        onClose={() => toggleModal(false, Modals.NONE)}
        logo="https://i.imgur.com/AtCmxQF.png"
        images={['./playlist1.png', './playlist2.png', './playlist3.png']}
        alts={['test', 'test', 'test']}
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
          'Screenshot of Classabull with a filled schedule',
          'Screenshot of Classabull with an empty schedule',
          'Second screenshot of Classabull with a filled schedule',
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
