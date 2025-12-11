export function compareDate(post_date){
  const sunday = new Date();
  sunday.setDate(sunday.getDate()-sunday.getDay());
  const post = new Date(post_date);
  sunday.setHours(0, 0, 0, 0);
  if(post > sunday){return true;}
  return false;
}