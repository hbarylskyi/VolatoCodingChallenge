export function stringsToNums(stringArr: string[]): number[] {
  return stringArr
    .map(string => {
      const num = Number(string);

      if (!isNaN(num)) {
        return num;
      }
    })
    .filter(val => val !== undefined) as number[];
}
