export function makeId(prefix,sequence){const d=new Date();const yy=String(d.getFullYear()).slice(-2);const md=`${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`;return `${prefix}-${yy}-${md}-${String(sequence).padStart(4,'0')}`;}
export function makeEventId(sequence){return `EV-${String(sequence).padStart(6,'0')}`;}
export function makeUserId(sequence){return makeId('U',sequence);}
