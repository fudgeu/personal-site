export default function transitionStyle(
  styles: { [key: string]: string }, baseStyle: string, state: string,
): string {
  const str = '';
  return str.concat(styles[baseStyle], ' ', styles[`${baseStyle}-${state}`]);
}
