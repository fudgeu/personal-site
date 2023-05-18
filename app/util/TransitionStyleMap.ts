export default function transitionStyle(styles: {[key: string]: string}, baseStyle: string, state: string): string {
	return styles[`${baseStyle}`] + " " + styles[`${baseStyle}-${state}`]
}