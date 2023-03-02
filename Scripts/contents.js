

console.log("Sundial startup")
const timeMatchRegExp = /(\d{1,2})(:\d{2})?(:\d{2})?\s?(A.?M.?\s? | P.?M.?\s?)(UTC|GMT|ES?T|CST|MST|PST|AKST|HST)/gi;
let replaced = document.body.innerHTML.replace(timeMatchRegExp, convertTime);
document.body.innerHTML = replaced;

// for(pg of paragraphs){
//     console.log(pg.innerHTML);
//     pg.innerHTML = pg.innerHTML.replace(timeMatchRegExp, "[THIS IS A TIME]");
// }

function convertTime(timeString){
    console.log("called convertTime");
    return "TIME";
}
