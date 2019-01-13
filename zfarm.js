"use strict";function remove(a){a.parentNode.removeChild(a)}function switch_theme(){var a=$("#dark");localStorage.dark=(a.disabled=!a.disabled)?"":"1"}function show_alert(a,b){$("#alert").innerHTML+="<p class="+a+">\n			<span class=badge onclick='remove(this.parentNode)'>×</span>\n			"+b+"\n		</p>"}function create_share(a){var b=localStorage.notation+":";b+=$$("input,select").map(function(a){return a.value.replace(":","")}).join(":");var c=location.href.replace(/[#?].*/,"");c+="?"+LZString.compressToEncodedURIComponent(b),a(c)}function exit_share(){history.pushState({},"","perks.html"),$("textarea").removeEventListener("click",exit_share),$$("[data-saved]").forEach(function(a){return a.value=localStorage[a.id]||a.value})}function load_share(a){var b=LZString.decompressFromEncodedURIComponent(a).split(":"),c=localStorage.notation;localStorage.notation=b.shift(),$$("input,select").forEach(function(a){return a.value=b.shift()}),$("textarea").addEventListener("click",exit_share),$("form").submit(),localStorage.notation=c||1}function prettify(a){if(0>a)return"-"+prettify(-a);if(1e4>a)return+a.toPrecision(4)+"";if("0"===localStorage.notation)return a.toExponential(2).replace("+","");for(var b=0;a>=999.5;)a/=1e3,++b;var c=notations[localStorage.notation||1],d=b>c.length?"e"+3*b:c[b-1];return+a.toPrecision(3)+d}function parse_suffixes(a){a=a.replace(/\*.*|[^--9+a-z]/gi,"");for(var b=notations["3"===localStorage.notation?3:1],c=b.length;c>0;--c)a=a.replace(new RegExp(b[c-1]+"$","i"),"E"+3*c);return+a}function input(a){return parse_suffixes($("#"+a).value)}function check_input(a){var b=isFinite(parse_suffixes(a.value)),c="3"===localStorage.notation?"alphabetic ":"";a.setCustomValidity(b?"":"Invalid "+c+"number: "+a.value)}function mastery(a){if(!game.talents[a])throw"unknown mastery: "+a;return game.talents[a].purchased}function toggle_spoilers(){$$("[data-hide]").forEach(function(a){a.style.display=+localStorage.hze>=+a.getAttribute("data-hide")?"":"none"})}function set_hze(a){+localStorage.hze>a||(localStorage.hze=a,toggle_spoilers())}function handle_paste(a,b,c){var d=a.clipboardData.getData("text/plain").replace(/\s/g,"");try{game=JSON.parse(LZString.decompressFromBase64(d));var e=4.9,f=4.91;game.global.version>f+.009?show_alert("warning","This calculator only supports up to v"+f+" of Trimps, but your save is from v"+game.global.version+". Results may be inaccurate."):game.global.version<e&&show_alert("warning","Trimps v"+e+" is out! Your save is still on v"+game.global.version+", so you should refresh the game’s page.")}catch(g){if(game&&game.Looting)throw"This is a perk string. You have to export your save (from the main screen), not your perks.";throw"Your clipboard did not contain a valid Trimps save. Open the game, click “Export” then “Copy to Clipboard”, and try again."}localStorage.save=d,localStorage.notation=game.options.menu.standardNotation.enabled,jobless="Job"==game.global.ShieldEquipped.name,set_hze(game.global.highestLevelCleared+1),b(),c()}function get_paste_back(){$("#save").value=localStorage.save,$("#save").onfocus=null,$("#save").focus(),$("#save").select()}function read_save(){for(var a=0,b=0,c=["Chronoimp","Jestimp","Titimp","Flutimp","Goblimp"];b<c.length;b++){var d=c[b];a+=game.unlocks.imps[d]}var e=game.heirlooms.Shield,f=game.global.challengeActive,g=game.global.soldierCurrentAttack*(1+e.trimpAttack.currentBonus/100),h=5*game.portal.Relentlessness.level+e.critChance.currentBonus,i=100+30*game.portal.Relentlessness.level+e.critDamage.currentBonus,j=5,k=.8+.02*game.portal.Range.level,l=1.2,m=1,n=1,o=game.global.world,p=game.global.highestLevelCleared>=109,q=game.empowerments[["Poison","Wind","Ice"][ceil(o/5)%3]],r=mastery("nature3")?5:0,s=10*Math.pow(.95,game.portal.Agility.level)-mastery("hyperspeed");death_stuff={max_hp:game.global.soldierHealthMax,block:game.global.soldierCurrentBlock,challenge_attack:1,enemy_cd:1,breed_timer:compute_breed_timer(),weakness:0,plague:0,bleed:0,explosion:0,nom:"Nom"===f,slow:"Slow"===f},(mastery("hyperspeed2")&&o<=ceil(game.global.highestLevelCleared/2)||jobless)&&--s,g*=1+.02*game.global.antiStacks*game.portal.Anticipation.level,g*=1+.01*game.global.achievementBonus,g*=1+.2*game.global.roboTrimpLevel,g*=1+game.goldenUpgrades.Battle.currentBonus,g*=1+.01*game.global.totalSquaredReward,g/=[1,.5,4,.5,.5][game.global.formation];var t=game.portal.Capable.level,u=game.global.fluffyPrestige,v=log(.003*game.global.fluffyExp/Math.pow(5,u)+1)/log(4),w=min(floor(v),t),x=w==t?0:(Math.pow(4,v-w)-1)/3,y=u+w+mastery("fluffyAbility");g*=1+.1*Math.pow(5,u)*(w/2+x)*(w+1);var z=1+ +(y>=13)+ +(y>=10)+mastery("overkill");if(y>=14&&(h+=50),y>=15&&(j+=2),game.global.sugarRush>0&&(g*=floor(o/100)),game.singleRunBonuses.sharpTrimps.owned&&(g*=1.5),mastery("stillRowing2")&&(g*=1+.06*game.global.spireRows),mastery("magmamancer")){var A=((new Date).getTime()-game.global.zoneStarted)/6e4,B=Math.pow(1.2,min(12,floor((A+5)/10)))-1;g*=1+3*(1-Math.pow(.9999,game.jobs.Magmamancer.owned))*B}if(mastery("healthStrength")){var C=min(o,100*game.global.lastSpireCleared+199),D=300>C?0:floor((C-270)/15);g*=1+.15*D}if(g*=mastery("amalg")?Math.pow(1.5,game.jobs.Amalgamator.owned):1+.5*game.jobs.Amalgamator.owned,mastery("crit")&&(j+=1,h+=.5*e.critChance.currentBonus),"Discipline"===f)k=.005,l=1.995;else if("Balance"===f)m*=2,n*=2.35;else if("Meditate"===f)m*=2,n*=1.5;else if("Electricity"===f)death_stuff.weakness=.1,death_stuff.plague=.1;else if("Daily"===f){mastery("daily")&&(g*=1.5);var E=function(a){return game.global.dailyChallenge[a]?game.global.dailyChallenge[a].strength:0};g*=o%2==1?1-.02*E("oddTrimpNerf"):1+.2*E("evenTrimpBuff"),g*=1+.1*ceil(E("rampage")/10)*(1+E("rampage")%10),h+=10*E("trimpCritChanceUp"),h-=10*E("trimpCritChanceDown"),k-=E("minDamage")?.09+.01*E("minDamage"):0,l+=E("maxDamage"),m*=1+.2*E("badHealth"),m*=1+.3*E("badMapHealth"),n*=1+.2*E("badStrength"),n*=1+.3*E("badMapStrength"),death_stuff.plague=.01*E("plague"),death_stuff.bleed=.01*E("bogged"),death_stuff.weakness=.01*E("weakness"),death_stuff.enemy_cd=1+.5*E("crits"),death_stuff.explosion=E("explosive")}else"Life"===f?(m*=11,n*=6,g*=1+.1*game.challenges.Life.stacks,death_stuff.max_hp*=1+.1*game.challenges.Life.stacks):"Crushed"===f?death_stuff.enemy_cd=5:"Nom"===f?death_stuff.bleed=.05:"Toxicity"===f?(m*=2,n*=5,death_stuff.bleed=.05):"Lead"===f?(o%2==1?g*=1.5:show_alert("warning","Are you <b>sure</b> you want to farm on an even Lead zone?"),m*=1+.04*game.challenges.Lead.stacks,n*=1+.04*game.challenges.Lead.stacks):"Corrupted"===f?n*=3:"Obliterated"===f&&(m*=Math.pow(10,12+floor(o/10)),n*=Math.pow(10,12+floor(o/10)));g*=h>=100?(1+i/100)*Math.pow(j,floor(h/100)-1):Math.pow(j,floor(h/100)),i=h>=100?100*(j-1):i,h%=100,$("#attack").value=prettify(g*k),$("#cc").value=h,$("#cd").value=i,$("#challenge").value=prettify(m),$("#coordinate").checked="Coordinate"===f,$("#difficulty").value=prettify((p?75:80)+("Mapocalypse"===f?300:0)),$("#fragments").value=prettify(game.resources.fragments.owned),$("#hze").value=prettify(game.global.highestLevelCleared+1),$("#imports").value=prettify(a),$("#nature").value=o>=236?q.level+r:0,$("#ok_spread").value=prettify(z),$("#overkill").value=game.portal.Overkill.level,$("#plaguebringer").value=e.plaguebringer.currentBonus,$("#range").value=prettify(l/k),$("#reducer").checked=mastery("mapLoot"),$("#size").value=prettify(mastery("mapLoot2")?20:p?25:27),$("#speed").value=prettify(s),$("#titimp").checked=game.unlocks.imps.Titimp,$("#transfer").value=o>=236?q.retainLevel+r:0,$("#zone").value=o,death_stuff.challenge_attack=n}function get_best(a,b){for(var c={overall:"",stance:"",second:"",second_stance:"",ratio:0},d=function(b){a.sort(function(a,c){return c[b].value-a[b].value}),c[b]=a[0].zone},e=0,f=b;e<f.length;e++){var g=f[e];d(g)}return a.sort(function(a,b){return b.value-a.value}),c.overall=a[0].zone,c.stance=a[0].stance,a[1]&&(c.second=a[1].zone,c.second_stance=a[1].stance,c.ratio=a[0].value/a[1].value),c}function display(a){var b=a[0],c=a[1];if(0===b.length)throw"Your attack is too low to farm anywhere.";var d=get_best(b.slice(),c),e=input("zone")>=60,f="";c.length>1&&(f+="<tr><th colspan=2>"+c.replace(/(?!$)/g,"<th colspan=2>")+"</tr>"),f+="<tr><th>Level<th>Base loot";for(var g=0,h=c;g<h.length;g++){h[g];f+="<th>Cells/s<th>Total"}for(var i=0,j=b;i<j.length;i++){var k=j[i],l=k.zone;f+="</tr><tr><td class=align-right>";for(var m=0,n=c;m<n.length;m++){var o=n[m];l===d[o]&&e&&(f+="<b>"+o+"</b> ")}f+=l===d.overall?"<b>"+l+"</b>":l,f+="<td>"+prettify(k.loot)+"%";for(var p=0,q=c;p<q.length;p++){var o=q[p],r=prettify(k[o].value);f+="<td>"+k[o].speed.toFixed(3)+"<td>",f+=l===d[o]?"<b>"+r+"</b>":r}}if($("#details").innerHTML=f+"</tr>",$("#results").style.opacity="1",e&&(d.overall+=" in "+d.stance,d.second+=" in "+d.second_stance),1==b.length)return void(input("zone")%100===0&&input("zone")>100?($("#result").textContent="You should definitely farm on "+d.overall,$("#comment").textContent="Good luck with the Spire!"):($("#result").textContent="You should really be pushing rather than farming",$("#comment").textContent=""));var s=100*(d.ratio-1),t=[""," probably",""," really"," definitely"][min(floor(s/2),4)];$("#result").textContent="You should "+t+" farm on "+d.overall,2>s&&($("#result").textContent+=" or "+d.second),$("#comment").textContent=2>s?"They’re equally efficient.":4>s?"But "+d.second+" is almost as good.":"It’s "+s.toFixed(1)+"% more efficient than "+d.second+"."}function main(){display(stats(parse_inputs()))}function rng(){return seed^=seed>>11,seed^=seed<<8,seed^=seed>>19,seed*rand_mult}function simulate(a,b){function c(b){var c=b*(.8+.4*rng());c*=rng()<.25?a.enemy_cd:1,c*=Math.pow(.366,p*a.ice),d-=max(0,c-a.block),++e}for(var d=a.max_hp,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=[],r=[],s=0;s<a.size;++s){var t=14.3*sqrt(b*Math.pow(3.265,b))-12.1;t*=60>b?3+3/110*g:(5+.08*g)*Math.pow(1.1,b-59),a.zone>=230&&(t*=round(50*Math.pow(1.05,floor((a.zone-150)/6)))/10),game&&mastery("bionic2")&&b>a.zone&&(t/=1.5),q.push(a.difficulty*a.challenge_health*t);var u=5.5*sqrt(b*Math.pow(3.27,b))-1.1;u*=60>b?3.1875+.0595*g:(4+.09*g)*Math.pow(1.15,b-59),a.zone>=230&&(u*=round(15*Math.pow(1.05,floor((a.zone-150)/6)))/10),r.push(a.difficulty*a.challenge_attack*u)}for(;max_ticks>j;){var v=rng(),w=v<a.import_chance?[1,1,!1]:a.biome[floor(rng()*a.biome.length)],u=w[0]*r[g],t=w[1]*q[g],x=t,y=a.slow||w[2]&&!a.nom;0!==m&&(t-=l,--m),t=min(t,max(.05*x,t-k)),k=0;for(var z=0;t>=1&&max_ticks>j;){if(++z,y&&c(u),d>=1){m=a.ok_spread;var A=a.atk*(1+a.range*rng());A*=rng()<a.cc?a.cd:1,A*=f>j?2:1,A*=2-Math.pow(.366,p*a.ice),A*=1-a.weakness*min(e,9),t-=A+n*a.poison,n+=A,++p,t>=1&&(k+=A*a.plaguebringer)}d-=a.bleed*a.max_hp,d-=e*a.plague*a.max_hp,!y&&t>=1&&d>=1&&c(u),1>d&&(j+=ceil(z*a.speed),j=max(j,i+a.breed_timer),i=j,d=a.max_hp,j+=1,z=1,e=0,a.nom&&(t=min(t+.05*x,x)))}a.explosion&&(a.explosion<=15||a.block>=a.max_hp)&&(d-=max(0,a.explosion*u-a.block)),o=min(o+z,200),h+=1+o*a.wind,l=-t*a.overkill,j+=+(z>0)+ +(a.speed>9)+ceil(z*a.speed),a.titimp&&.03>v&&(f=min(max(j,f)+300,j+450)),n=ceil(a.transfer*n+k)+1,o=ceil(a.transfer*o)+1+ceil((z-1)*a.plaguebringer),p=ceil(a.transfer*p)+1+ceil((z-1)*a.plaguebringer),++g,g==a.size&&(g=0,k=0,l=0)}return 10*h/max_ticks}function zone_stats(a,b,c){for(var d={zone:"z"+a,value:0,stance:"",loot:100*(a<c.zone?Math.pow(.8,c.zone-c.reducer-a):Math.pow(1.1,a-c.zone))},e=0,f=b;e<f.length;e++){var g=f[e];c.atk=c.attack*("D"==g?4:"X"==g?1:.5);var h=simulate(c,a),i=h*d.loot*("S"==g?2:1);d[g]={speed:h,value:i},i>d.value&&(d.value=i,d.stance=g)}return d}function map_cost(a,b){return a+=b,a*Math.pow(1.14,a)*b*Math.pow(1.03+b/5e4,b)/42.75}function compute_breed_timer(){var a=.1*game.resources.trimps.potency;a*=Math.pow(1.1,game.upgrades.Potency.done),a*=Math.pow(1.01,game.buildings.Nursery.owned),a*=Math.pow(.98,game.jobs.Geneticist.owned),a*=Math.pow(1.003,game.unlocks.impCount.Venimp),a*=1+.1*game.portal.Pheromones.level,game.global.brokenPlanet&&(a*=.1),game.singleRunBonuses.quickTrimps.owned&&(a*=2);for(var b=1,c=0;c<game.upgrades.Coordination.done;++c)b=ceil(b*(1+.25*Math.pow(.98,game.portal.Coordinated.level)));b*=Math.pow(1e3,game.jobs.Amalgamator.owned);var d=game.resources.trimps.max*game.resources.trimps.maxMod;d*=Math.pow(1.1,game.portal.Carpentry.level),d*=1+.0025*game.portal.Carpentry_II.level;for(var e=0,f=game.jobs;e<f.length;e++){var g=f[e];d-=game.jobs[g].owned}return ceil(log(d/(d-b))/log(1+a))}function stats(a){var b=[],c=(a.zone<70?"X":"D")+(a.hze>=181&&a.zone>=60?"S":"");console.time();var d=0;if(a.hze>=210)for(;10>d&&a.fragments>map_cost(53.98+10*d,a.zone);)++d;d=d||-a.reducer;for(var e=a.zone+d;e>=6;--e){if(a.coordinate){for(var f=1,g=1;e>g;++g)f=ceil(1.25*f);a.challenge_health=f,a.challenge_attack=f}var h=zone_stats(e,c,a);if(!(h.value<1&&e>=a.zone)){if(b.length&&h.value<.804*b[0].value)break;b.unshift(h)}}return console.timeEnd(),[b,c]}var __assign=this&&this.__assign||Object.assign||function(a){for(var b,c=1,d=arguments.length;d>c;c++){b=arguments[c];for(var e in b)Object.prototype.hasOwnProperty.call(b,e)&&(a[e]=b[e])}return a},abs=Math.abs,ceil=Math.ceil,floor=Math.floor,log=Math.log,max=Math.max,min=Math.min,pow=Math.pow,round=Math.round,sqrt=Math.sqrt,jobless=!1,$=function(a){return document.querySelector(a)},$$=function(a){return[].slice.apply(document.querySelectorAll(a))};$("#dark").disabled=!localStorage.dark;var notations=[[],"KMBTQaQiSxSpOcNoDcUdDdTdQadQidSxdSpdOdNdVUvDvTvQavQivSxvSpvOvNvTgUtgDtgTtgQatgQitgSxtgSptgOtgNtgQaaUqaDqaTqaQaqaQiqaSxqaSpqaOqaNqaQiaUqiDqiTqiQaqiQiqiSxqiSpqiOqiNqiSxaUsxDsxTsxQasxQisxSxsxSpsxOsxNsxSpaUspDspTspQaspQispSxspSpspOspNspOgUogDogTogQaogQiogSxogSpogOogNogNaUnDnTnQanQinSxnSpnOnNnCtUc".split(/(?=[A-Z])/),[],"a b c d e f g h i j k l m n o p q r s t u v w x y z aa ab ac ad ae af ag ah ai aj ak al am an ao ap aq ar as at au av aw ax ay az ba bb bc bd be bf bg bh bi bj bk bl bm bn bo bp bq br bs bt bu bv bw bx by bz ca cb cc cd ce cf cg ch ci cj ck cl cm cn co cp cq cr cs ct cu cv cw cx".split(" "),"KMBTQaQiSxSpOcNoDcUdDdTdQadQidSxdSpdOdNdVUvDvTvQavQivSxvSpvOvNvTg".split(/(?=[A-Z])/)];window.addEventListener("error",function(a){return"string"==typeof a.error?void show_alert("ko",a.error):void("Script error."!=a.message&&create_share(function(b){return show_alert("ko","Oops! It’s not your fault, but something went wrong. You can go pester the dev on\n	<a href=https://github.com/Grimy/Grimy.github.io/issues/new>GitHub</a> or\n	<a href=https://www.reddit.com/message/compose/?to=Grimy_>Reddit</a>, he’ll fix it.\n	If you do, please include the following data:<br>\n	<tt>"+b+"<br>"+a.filename+" l"+(a.lineno||0)+"c"+(a.colno||0)+" "+a.message+"</tt>.")}))});var game;document.addEventListener("DOMContentLoaded",toggle_spoilers),document.addEventListener("DOMContentLoaded",function(){var a="2.4";a>localStorage.version&&show_alert("ok","Welcome to Trimps tools v"+a+"! See what’s new in the <a href=changelog.html>changelog</a>."),localStorage.version=a,location.search&&load_share(location.search.substr(1)),$$("[data-saved]").forEach(function(a){"checkbox"===a.type?(a.checked="true"===localStorage[a.id],a.addEventListener("change",function(){return localStorage[a.id]=a.checked})):(a.value=localStorage[a.id]||a.value,a.addEventListener("change",function(){return localStorage[a.id]=a.value}))})},!1);var death_stuff={max_hp:1e300,block:0,challenge_attack:1,enemy_cd:1,breed_timer:300,weakness:0,plague:0,bleed:0,explosion:0,nom:!1,slow:!1},parse_inputs=function(){return __assign((a={attack:input("attack"),biome:biomes.all.concat(biomes[$("#biome").value]),cc:input("cc")/100,cd:1+input("cd")/100,challenge_health:input("challenge"),coordinate:$("#coordinate").checked,difficulty:input("difficulty")/100,fragments:input("fragments"),hze:input("hze"),import_chance:.03*input("imports"),ok_spread:input("ok_spread"),overkill:.005*input("overkill"),plaguebringer:.01*input("plaguebringer"),range:input("range")-1,reducer:$("#reducer").checked,size:input("size"),speed:input("speed"),titimp:$("#titimp").checked,transfer:input("transfer")/100,zone:input("zone"),poison:0,wind:0,ice:0},a[["poison","wind","ice"][ceil(input("zone")/5)%3]]=input("nature")/100,a),death_stuff);var a},max_ticks=864e3,test=[1,2],biomes={all:[[.8,.7,!0],[.9,1.3,!1],[.9,1.3,!1],[1,1,!1],[1.1,.7,!1],[1.05,.8,!0],[.9,1.1,!0]],gardens:[[1.3,.95,!1],[.95,.95,!0],[.8,1,!1],[1.05,.8,!1],[.6,1.3,!0],[1,1.1,!1],[.8,1.4,!1]],sea:[[.8,.9,!0],[.8,1.1,!0],[1.4,1.1,!1]],mountain:[[.5,2,!1],[.8,1.4,!1],[1.15,1.4,!1],[1,.85,!0]],forest:[[.75,1.2,!0],[1,.85,!0],[1.1,1.5,!1]],depths:[[1.2,1.4,!1],[.9,1,!0],[1.2,.7,!1],[1,.8,!0]]},seed=42,rand_mult=Math.pow(2,-31);