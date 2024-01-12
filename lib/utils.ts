/**
 * Merge class names together.
 * @param classes
 */
export function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}


export function formatCount(count:number){
  if(count < 1000){
    return count.toString();
  }else {
    return (count/1000).toFixed(1) + 'k'
  }
}