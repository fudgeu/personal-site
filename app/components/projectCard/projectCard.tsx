import styles from './style.module.css'

type ProjectCardProps = {
  children: React.ReactNode
}

export default function ProjectCard({ children }: ProjectCardProps) {
	return (
		<div className={styles.projectCard}>
			{children}
		</div>
	)
}