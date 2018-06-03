"use strict";function remove(a){a.parentNode.removeChild(a)}function switch_theme(){var a=$("#dark");localStorage.dark=(a.disabled=!a.disabled)?"":"1"}function show_alert(a,b){$("#alert").innerHTML+="<p class="+a+">\n			<span class=badge onclick='remove(this.parentNode)'>×</span>\n			"+b+"\n		</p>"}function create_share(a){var b=localStorage.notation+":";b+=$$("input,select").map(function(a){return a.value.replace(":","")}).join(":");var c=location.href.replace(/[#?].*/,"");c+="?"+LZString.compressToEncodedURIComponent(b),a(c)}function exit_share(){history.pushState({},"","perks.html"),$("textarea").removeEventListener("click",exit_share),$$("[data-saved]").forEach(function(a){return a.value=localStorage[a.id]||a.value})}function load_share(a){var b=LZString.decompressFromEncodedURIComponent(a).split(":"),c=localStorage.notation;localStorage.notation=b.shift(),$$("input,select").forEach(function(a){return a.value=b.shift()}),$("textarea").addEventListener("click",exit_share),$("form").submit(),localStorage.notation=c||1}function prettify(a){if(0>a)return"-"+prettify(-a);if(1e4>a)return+a.toPrecision(4)+"";if("0"===localStorage.notation)return a.toExponential(2).replace("+","");for(var b=0;a>=999.5;)a/=1e3,++b;var c=notations[localStorage.notation||1],d=b>c.length?"e"+3*b:c[b-1];return+a.toPrecision(3)+d}function parse_suffixes(a){a=a.replace(/\*.*|[^--9+a-z]/gi,"");for(var b=notations["3"===localStorage.notation?3:1],c=b.length;c>0;--c)a=a.replace(new RegExp(b[c-1]+"$","i"),"E"+3*c);return+a}function input(a){return parse_suffixes($("#"+a).value)}function check_input(a){var b=isFinite(parse_suffixes(a.value)),c="3"===localStorage.notation?"alphabetic ":"";a.setCustomValidity(b?"":"Invalid "+c+"number: "+a.value)}function mastery(a){if(!game.talents[a])throw"unknown mastery: "+a;return game.talents[a].purchased}function toggle_spoilers(){$$("[data-hide]").forEach(function(a){a.style.display=+localStorage.hze>=+a.getAttribute("data-hide")?"":"none"})}function set_hze(a){+localStorage.hze>a||(localStorage.hze=a,toggle_spoilers())}function handle_paste(a,b,c){var d=a.clipboardData.getData("text/plain").replace(/\s/g,"");try{game=JSON.parse(LZString.decompressFromBase64(d));var e=4.72,f=4.8;game.global.version>f+.009?show_alert("warning","This calculator only supports up to v"+f+" of Trimps, but your save is from v"+game.global.version+". Results may be inaccurate."):game.global.version<e&&show_alert("warning","Trimps v"+e+" is out! Your save is still on v"+game.global.version+", so you should refresh the game’s page.")}catch(g){throw"Your clipboard did not contain a valid Trimps save. Open the game, click “Export” then “Copy to Clipboard”, and try again."}localStorage.notation=game.options.menu.standardNotation.enabled,set_hze(game.global.highestLevelCleared+1),b(),c()}function read_save(){for(var a=0,b=0,c=["Chronoimp","Jestimp","Titimp","Flutimp","Goblimp"];b<c.length;b++){var d=c[b];a+=game.unlocks.imps[d]}var e=game.heirlooms.Shield,f=game.global.challengeActive,g=game.global.soldierCurrentAttack,h=5*game.portal.Relentlessness.level+e.critChance.currentBonus,i=100+30*game.portal.Relentlessness.level+e.critDamage.currentBonus,j=.8+.02*game.portal.Range.level,k=1.2,l=1,m=game.global.world,n=game.global.highestLevelCleared>=109,o=game.empowerments[["Poison","Wind","Ice"][ceil(m/5)%3]],p=mastery("nature3")?5:0,q=10*pow(.95,game.portal.Agility.level)-mastery("hyperspeed");mastery("hyperspeed2")&&m<=ceil(game.global.highestLevelCleared/2)&&--q;var r=game.global.version>=4.8;g*=1+.5*game.jobs.Amalgamator.owned,g*=1+.02*game.global.antiStacks*game.portal.Anticipation.level,g*=1+.01*game.global.achievementBonus,g*=1+.2*game.global.roboTrimpLevel,g*=1+game.goldenUpgrades.Battle.currentBonus,g*=1+.01*game.global.totalSquaredReward,g/=[1,.5,4,.5,.5][game.global.formation];var s=game.portal.Capable.level,t=game.global.fluffyPrestige,u=log(.003*game.global.fluffyExp/pow(5,t)+1)/log(4),v=min(floor(u),s),w=v==s?0:(pow(4,u-v)-1)/3;if(g*=1+.1*pow(5,t)*(v/2+w)*(v+1),v+t>=14&&(h+=50),game.global.sugarRush>0&&(g*=floor(m/100)),r&&game.singleRunBonuses.sharpTrimps.owned&&(g*=1.5),mastery("stillRowing2")&&(g*=1+.06*game.global.spireRows),mastery("magmamancer")){var x=((new Date).getTime()-game.global.zoneStarted)/6e4,y=pow(1.2,min(12,floor((x+5)/10)))-1;g*=1+3*(1-pow(.9999,game.jobs.Magmamancer.owned))*y}if(mastery("healthStrength")){var z=min(m,100*game.global.lastSpireCleared+199),A=300>z?0:floor((z-270)/15);g*=1+.15*A}if("Discipline"===f)j=.005,k=1.995;else if("Balance"===f||"Meditate"===f||"Toxicity"===f)l*=2;else if("Daily"===f){var B=function(a){return game.global.dailyChallenge[a]?game.global.dailyChallenge[a].strength:0};g*=m%2==1?1-.02*B("oddTrimpNerf"):1+.2*B("evenTrimpBuff"),g*=1-.09*B("weakness"),g*=1+.1*ceil(B("rampage")/10)*(1+B("rampage")%10),h+=10*B("trimpCritChanceUp"),h-=10*B("trimpCritChanceDown"),j-=B("minDamage")?.09+.01*B("minDamage"):0,k+=B("maxDamage"),l*=1+.2*B("badHealth"),l*=1+.3*B("badMapHealth")}else"Life"===f?(l*=11,g*=1+.1*game.challenges.Life.stacks):"Lead"===f?(m%2==1?g*=1.5:show_alert("warning","Are you <b>sure</b> you want to farm on an even Lead zone?"),l*=1+.04*game.challenges.Lead.stacks):"Obliterated"===f&&(l*=pow(10,12+floor(m/10)));$("#attack").value=prettify(g*j),$("#cc").value=h,$("#cd").value=i,$("#challenge").value=prettify(l),$("#coordinate").checked="Coordinate"===f,$("#difficulty").value=prettify((n?75:80)+("Mapocalypse"===f?300:0)),$("#fragments").value=prettify(game.resources.fragments.owned),$("#hze").value=prettify(game.global.highestLevelCleared+1),$("#imports").value=prettify(a),$("#nature").value=m>=236?o.level+p:0,$("#ok_spread").value=prettify(v+t>=13?3:v+t>=10?2:1),$("#overkill").value=game.portal.Overkill.level,$("#plaguebringer").value=r?e.plaguebringer.currentBonus:0,$("#range").value=prettify(k/j),$("#reducer").checked=mastery("mapLoot"),$("#size").value=prettify(mastery("mapLoot2")?20:n?25:27),$("#speed").value=prettify(q),$("#titimp").checked=game.unlocks.imps.Titimp,$("#transfer").value=m>=236?o.retainLevel+p:0,$("#zone").value=m}function get_best(a,b){for(var c={overall:"",stance:"",second:"",second_stance:"",ratio:0},d=function(b){a.sort(function(a,c){return c[b].value-a[b].value}),c[b]=a[0].zone},e=0,f=b;e<f.length;e++){var g=f[e];d(g)}return a.sort(function(a,b){return b.value-a.value}),c.overall=a[0].zone,c.stance=a[0].stance,a[1]&&(c.second=a[1].zone,c.second_stance=a[1].stance,c.ratio=a[0].value/a[1].value),c}function display(a){var b=a[0],c=a[1];if(0===b.length)throw"Your attack is too low to farm anywhere.";var d=get_best(b.slice(),c),e=input("zone")>=60,f="";c.length>1&&(f+="<tr><th colspan=2>"+c.replace(/(?!$)/g,"<th colspan=2>")+"</tr>"),f+="<tr><th>Level<th>Base loot";for(var g=0,h=c;g<h.length;g++){h[g];f+="<th>Cells/s<th>Total"}for(var i=0,j=b;i<j.length;i++){var k=j[i],l=k.zone;f+="</tr><tr><td class=align-right>";for(var m=0,n=c;m<n.length;m++){var o=n[m];l===d[o]&&e&&(f+="<b>"+o+"</b> ")}f+=l===d.overall?"<b>"+l+"</b>":l,f+="<td>"+prettify(k.loot)+"%";for(var p=0,q=c;p<q.length;p++){var o=q[p],r=prettify(k[o].value);f+="<td>"+k[o].speed.toFixed(3)+"<td>",f+=l===d[o]?"<b>"+r+"</b>":r}}if($("#details").innerHTML=f+"</tr>",$("#results").style.opacity="1",e&&(d.overall+=" in "+d.stance,d.second+=" in "+d.second_stance),1==b.length)return void(input("zone")%100===0&&input("zone")>100?($("#result").textContent="You should definitely farm on "+d.overall,$("#comment").textContent="Good luck with the Spire!"):($("#result").textContent="You should really be pushing rather than farming",$("#comment").textContent=""));var s=100*(d.ratio-1),t=[""," probably",""," really"," definitely"][min(floor(s/2),4)];$("#result").textContent="You should "+t+" farm on "+d.overall,2>s&&($("#result").textContent+=" or "+d.second),$("#comment").textContent=2>s?"They’re equally efficient.":4>s?"But "+d.second+" is almost as good.":"It’s "+s.toFixed(1)+"% more efficient than "+d.second+"."}function main(){display(stats(parse_inputs()))}function rng(){return seed^=seed>>11,seed^=seed<<8,seed^=seed>>19,seed*rand_mult}function enemy_hp(a,b,c){var d=14.3*sqrt(b*pow(3.265,b))-12.1;return d*=60>b?3+3/110*c:(5+.08*c)*pow(1.1,b-59),a.zone>=230&&(d*=round(50*pow(1.05,floor(a.zone/6-25)))/10),a.difficulty*a.challenge*d}function enemy_atk(a,b){var c=5.5*sqrt(a*pow(3.27,a))-1.1;return c*=60>a?3.1875+.0595*b:(4+.09*b)*pow(1.15,a-59),c*=round(50*pow(1.05,floor(a/6-25)))/10}function simulate(a,b){for(var c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0;max_ticks>l;++d){var m=rng(),n=m<a.import_chance?1:a.biome[floor(m*a.biome.length)],o=n*enemy_hp(a,b,d%a.size);if(d%a.size!==0){var p=o;0!==h&&(o-=g,--h),o=min(o,max(.05*p,o-f))}f=0;for(var q=0;o>0;){++q,h=a.ok_spread;var r=a.atk*(1+a.range*rng());r*=rng()<a.cc?a.cd:1,r*=c>l?2:1,r*=2-pow(.366,k*a.ice),o-=r+i*a.poison,i+=r,++k,o>0&&(f+=r*a.plaguebringer)}j=min(j+q,200),e+=1+j*a.wind,g=-o*a.overkill,l+=+(q>0)+ +(a.speed>9)+ceil(q*a.speed),a.titimp&&.03>m&&(c=min(max(l,c)+300,l+450)),i=ceil(a.transfer*(i+f))+1,j=ceil(a.transfer*j)+1+ceil((q-1)*a.plaguebringer),k=ceil(a.transfer*k)+1+ceil((q-1)*a.plaguebringer)}return 10*e/max_ticks}function zone_stats(a,b,c){for(var d={zone:"z"+a,value:0,stance:"",loot:100*(a<c.zone?pow(.8,c.zone-c.reducer-a):pow(1.1,a-c.zone))},e=0,f=b;e<f.length;e++){var g=f[e];c.atk=c.attack*("D"==g?4:"X"==g?1:.5);var h=simulate(c,a),i=h*d.loot*("S"==g?2:1);d[g]={speed:h,value:i},i>d.value&&(d.value=i,d.stance=g)}return d}function map_cost(a,b){return a+=b,a*pow(1.14,a)*b*pow(1.03+b/5e4,b)/42.75}function stats(a){var b=[],c=(a.zone<70?"X":"D")+(a.hze>=181&&a.zone>=60?"S":"");a.attack*=a.cc>=1?a.cd*pow(5,floor(a.cc)-1):pow(5,floor(a.cc)),a.cd=floor(a.cc)?5:a.cd,a.cc-=floor(a.cc);var d=0;if(a.hze>=210)for(;10>d&&a.fragments>map_cost(53.98+10*d,a.zone);)++d;d=d||-a.reducer;for(var e=1;e<=a.zone+d;++e){var f=a.attack/(max.apply(0,a.biome)*enemy_hp(a,e,a.size-1));if(1e-4>f)break;e>=6&&(1>f||e==a.zone+d)&&b.push(zone_stats(e,c,a)),a.coordinate&&(a.challenge=ceil(1.25*a.challenge))}return[b,c]}var abs=Math.abs,ceil=Math.ceil,floor=Math.floor,log=Math.log,max=Math.max,min=Math.min,pow=Math.pow,round=Math.round,sqrt=Math.sqrt,$=function(a){return document.querySelector(a)},$$=function(a){return[].slice.apply(document.querySelectorAll(a))};$("#dark").disabled=!localStorage.dark;var notations=[[],"KMBTQaQiSxSpOcNoDcUdDdTdQadQidSxdSpdOdNdVUvDvTvQavQivSxvSpvOvNvTgUtgDtgTtgQatgQitgSxtgSptgOtgNtgQaaUqaDqaTqaQaqaQiqaSxqaSpqaOqaNqaQiaUqiDqiTqiQaqiQiqiSxqiSpqiOqiNqiSxaUsxDsxTsxQasxQisxSxsxSpsxOsxNsxSpaUspDspTspQaspQispSxspSpspOspNspOgUogDogTogQaogQiogSxogSpogOogNogNaUnDnTnQanQinSxnSpnOnNnCtUc".split(/(?=[A-Z])/),[],"a b c d e f g h i j k l m n o p q r s t u v w x y z aa ab ac ad ae af ag ah ai aj ak al am an ao ap aq ar as at au av aw ax ay az ba bb bc bd be bf bg bh bi bj bk bl bm bn bo bp bq br bs bt bu bv bw bx by bz ca cb cc cd ce cf cg ch ci cj ck cl cm cn co cp cq cr cs ct cu cv cw cx".split(" "),"KMBTQaQiSxSpOcNoDcUdDdTdQadQidSxdSpdOdNdVUvDvTvQavQivSxvSpvOvNvTg".split(/(?=[A-Z])/)];window.addEventListener("error",function(a){return"string"==typeof a.error?void show_alert("ko",a.error):void("Script error."!=a.message&&create_share(function(b){return show_alert("ko","Oops! It’s not your fault, but something went wrong. You can go pester the dev on\n	<a href=https://github.com/Grimy/Grimy.github.io/issues/new>GitHub</a> or\n	<a href=https://www.reddit.com/message/compose/?to=Grimy_>Reddit</a>, he’ll fix it.\n	If you do, please include the following data:<br>\n	<tt>"+b+"<br>"+a.filename+" l"+(a.lineno||0)+"c"+(a.colno||0)+" "+a.message+"</tt>.")}))});var game;document.addEventListener("DOMContentLoaded",toggle_spoilers),document.addEventListener("DOMContentLoaded",function(){var a="2.4";a>localStorage.version&&show_alert("ok","Welcome to Trimps tools v"+a+"! See what’s new in the <a href=changelog.html>changelog</a>."),localStorage.version=a,location.search&&load_share(location.search.substr(1)),$$("[data-saved]").forEach(function(a){"checkbox"===a.type?(a.checked="true"===localStorage[a.id],a.addEventListener("change",function(){return localStorage[a.id]=a.checked})):(a.value=localStorage[a.id]||a.value,a.addEventListener("change",function(){return localStorage[a.id]=a.value}))})},!1);var parse_inputs=function(){return a={attack:input("attack"),biome:biomes.all.concat(biomes[$("#biome").value]),cc:input("cc")/100,cd:1+input("cd")/100,challenge:input("challenge"),coordinate:$("#coordinate").checked,difficulty:input("difficulty")/100,fragments:input("fragments"),hze:input("hze"),import_chance:.03*input("imports"),ok_spread:input("ok_spread"),overkill:.005*input("overkill"),plaguebringer:.01*input("plaguebringer"),range:input("range")-1,reducer:$("#reducer").checked,size:input("size"),speed:input("speed"),titimp:$("#titimp").checked,transfer:input("transfer")/100,zone:input("zone"),poison:0,wind:0,ice:0},a[["poison","wind","ice"][ceil(input("zone")/5)%3]]=input("nature")/100,a;var a},max_ticks=864e3,test=[1,2],biomes={all:[.7,1.3,1.3,1,.7,.8,1.1],gardens:[.95,.95,1,.8,1.3,1.1,1.4],sea:[.9,1.1,1.1],mountain:[2,1.4,1.4,.85],forest:[1.2,1.5],depths:[1,.7,1.4,.8]},seed=42,rand_mult=pow(2,-31);