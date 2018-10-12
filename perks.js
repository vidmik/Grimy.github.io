"use strict";function remove(a){a.parentNode.removeChild(a)}function switch_theme(){var a=$("#dark");localStorage.dark=(a.disabled=!a.disabled)?"":"1"}function show_alert(a,b){$("#alert").innerHTML+="<p class="+a+">\n			<span class=badge onclick='remove(this.parentNode)'>×</span>\n			"+b+"\n		</p>"}function create_share(a){var b=localStorage.notation+":";b+=$$("input,select").map(function(a){return a.value.replace(":","")}).join(":");var c=location.href.replace(/[#?].*/,"");c+="?"+LZString.compressToEncodedURIComponent(b),a(c)}function exit_share(){history.pushState({},"","perks.html"),$("textarea").removeEventListener("click",exit_share),$$("[data-saved]").forEach(function(a){return a.value=localStorage[a.id]||a.value})}function load_share(a){var b=LZString.decompressFromEncodedURIComponent(a).split(":"),c=localStorage.notation;localStorage.notation=b.shift(),$$("input,select").forEach(function(a){return a.value=b.shift()}),$("textarea").addEventListener("click",exit_share),$("form").submit(),localStorage.notation=c||1}function prettify(a){if(0>a)return"-"+prettify(-a);if(1e4>a)return+a.toPrecision(4)+"";if("0"===localStorage.notation)return a.toExponential(2).replace("+","");for(var b=0;a>=999.5;)a/=1e3,++b;var c=notations[localStorage.notation||1],d=b>c.length?"e"+3*b:c[b-1];return+a.toPrecision(3)+d}function parse_suffixes(a){a=a.replace(/\*.*|[^--9+a-z]/gi,"");for(var b=notations["3"===localStorage.notation?3:1],c=b.length;c>0;--c)a=a.replace(new RegExp(b[c-1]+"$","i"),"E"+3*c);return+a}function input(a){return parse_suffixes($("#"+a).value)}function check_input(a){var b=isFinite(parse_suffixes(a.value)),c="3"===localStorage.notation?"alphabetic ":"";a.setCustomValidity(b?"":"Invalid "+c+"number: "+a.value)}function mastery(a){if(!game.talents[a])throw"unknown mastery: "+a;return game.talents[a].purchased}function toggle_spoilers(){$$("[data-hide]").forEach(function(a){a.style.display=+localStorage.hze>=+a.getAttribute("data-hide")?"":"none"})}function set_hze(a){+localStorage.hze>a||(localStorage.hze=a,toggle_spoilers())}function handle_paste(a,b,c){var d=a.clipboardData.getData("text/plain").replace(/\s/g,"");try{game=JSON.parse(LZString.decompressFromBase64(d));var e=4.9,f=4.91;game.global.version>f+.009?show_alert("warning","This calculator only supports up to v"+f+" of Trimps, but your save is from v"+game.global.version+". Results may be inaccurate."):game.global.version<e&&show_alert("warning","Trimps v"+e+" is out! Your save is still on v"+game.global.version+", so you should refresh the game’s page.")}catch(g){if(game&&game.Looting)throw"This is a perk string. You have to export your save (from the main screen), not your perks.";throw"Your clipboard did not contain a valid Trimps save. Open the game, click “Export” then “Copy to Clipboard”, and try again."}localStorage.save=d,localStorage.notation=game.options.menu.standardNotation.enabled,jobless="Job"==game.global.ShieldEquipped.name,set_hze(game.global.highestLevelCleared+1),b(),c()}function get_paste_back(){$("#save").value=localStorage.save,$("#save").onfocus=null,$("#save").focus(),$("#save").select()}function validate_fixed(){try{parse_perks($("#fixed").value,"l"),$("#fixed").setCustomValidity("")}catch(a){$("#fixed").setCustomValidity(a)}}function select_preset(a,b){void 0===b&&(b=!0),delete localStorage["weight-he"],delete localStorage["weight-atk"],delete localStorage["weight-hp"],delete localStorage["weight-xp"],c=presets[a],$("#weight-he").value=c[0],$("#weight-atk").value=c[1],$("#weight-hp").value=c[2],$("#weight-xp").value=floor((+presets[a][0]+ +presets[a][1]+ +presets[a][2])/5).toString();var c}function auto_preset(){var a=presets[$("#preset").value],b=a[0],c=a[1],d=a[2],e=floor((+b+ +c+ +d)/5).toString();$("#weight-he").value=localStorage["weight-he"]||b,$("#weight-atk").value=localStorage["weight-atk"]||c,$("#weight-hp").value=localStorage["weight-hp"]||d,$("#weight-xp").value=localStorage["weight-xp"]||e}function handle_respec(a){var b=game?game.resources.helium.owned:0;$("#helium").value=(input("helium")+b*(a?-1:1)).toString()}function update_dg(){function a(a){m+=a*c*sqrt(min(d,n)),n-=h}var b=input("zone")/2+115,c=5e8+5e7*game.generatorUpgrades.Efficiency.upgrades,d=3+.4*game.generatorUpgrades.Capacity.upgrades,e=game.permanentGeneratorUpgrades.Storage.owned?1.5*d:d,f=230+2*game.generatorUpgrades.Supply.upgrades,g=game.generatorUpgrades.Overclocker.upgrades;g=g&&1-.5*pow(.99,g-1);var h=game.permanentGeneratorUpgrades.Slowburn.owned?.4:.5,i=mastery("magmaFlow")?18:16,j=mastery("quickGen")?1.03:1.02,k=mastery("hyperspeed2")?(game.global.highestLevelCleared+1)/2:0,l=.5*mastery("blacksmith")+.25*mastery("blacksmith2")+.15*mastery("blacksmith3");l*=game.global.highestLevelCleared+1;for(var m=0,n=0,o=0,p=230;b>=p;++p){n+=i*(.01*min(p,f)-2.1);var q=ceil(60/pow(j,floor((p-230)/3)));for(o+=p>l?28:p>k?20:15;o>=q;)o-=q,a(1);for(;n>e;)a(g);m*=1.009}for(;n>=h;)a(1);$("#dg").value=prettify(m)}function read_save(){localStorage.zone||($("#zone").value=game.stats.highestVoidMap.valueTotal||game.global.highestLevelCleared);var a=input("zone");localStorage.preset||($$("#preset > *").forEach(function(a){a.selected=parseInt(a.innerHTML.replace("z",""))<game.global.highestLevelCleared}),auto_preset());var b=game.global.heliumLeftover;for(var c in game.portal)b+=game.portal[c].heliumSpent;var d=Object.keys(game.portal).filter(function(a){return!game.portal[a].locked});game.global.canRespecPerks||(d=d.map(function(a){return a+">"+game.portal[a].level}));var e=mastery("turkimp4")?1:mastery("turkimp3")?.6:mastery("turkimp2")?.4:mastery("turkimp")?.3:.25,f=1+e,g=1+.333*e,h=min(floor((a-101)/100),game.global.spiresCompleted);g*=100>a?.7:1+(mastery("stillRowing")?.3:.2)*h;for(var i=27*game.unlocks.imps.Jestimp+15*game.unlocks.imps.Chronoimp,j=60>a?0:85>a?7:160>a?10:185>a?14:20,k=0,l=game.global.StaffEquipped.mods||[];k<l.length;k++){var m=l[k];"MinerSpeed"===m[0]?f*=1+.01*m[1]:"metalDrop"===m[0]&&(g*=1+.01*m[1])}jobless?f=0:i+=(mastery("mapLoot2")?5:4)*j,update_dg(),$("#helium").value=b+($("#respec").checked?0:game.resources.helium.owned),$("#unlocks").value=d.join(","),$("#whipimp").checked=game.unlocks.imps.Whipimp,$("#magnimp").checked=game.unlocks.imps.Magnimp,$("#tauntimp").checked=game.unlocks.imps.Tauntimp,$("#venimp").checked=game.unlocks.imps.Venimp,$("#chronojest").value=prettify(i),$("#prod").value=prettify(f),$("#loot").value=prettify(g),$("#breed-timer").value=prettify(mastery("patience")?45:30)}function parse_inputs(){var a=$("#preset").value;if("trapper"==a&&(!game||"Trapper"!=game.global.challengeActive))throw"This preset requires a save currently running Trapper². Start a new run using “Trapper² (initial)”, export, and try again.";var b={total_he:input("helium"),zone:parseInt($("#zone").value),perks:parse_perks($("#fixed").value,$("#unlocks").value),weight:{helium:input("weight-he"),attack:input("weight-atk"),health:input("weight-hp"),xp:input("weight-xp"),trimps:0,income:0},fluffy:{xp:game?game.global.fluffyExp:0,prestige:game?game.global.fluffyPrestige:0},mod:{storage:.125,soldiers:0,dg:"nerfed"==a?0:input("dg"),tent_city:"tent"==a,whip:$("#whipimp").checked,magn:$("#magnimp").checked,taunt:$("#tauntimp").checked,ven:$("#venimp").checked,chronojest:input("chronojest"),prod:input("prod"),loot:input("loot"),breed_timer:input("breed-timer")}};"nerfed"==a&&(b.total_he=99999999,b.zone=200,b.mod.dg=0),"trapper"==a&&(b.mod.soldiers=game.resources.trimps.owned,b.mod.prod=0,b.perks.Pheromones.max_level=0,b.perks.Anticipation.max_level=0),"spire"==a&&(b.mod.prod=b.mod.loot=0,b.perks.Overkill.max_level=0,game&&(b.zone=game.global.world)),"carp"==a&&(b.mod.prod=b.mod.loot=0,b.weight.trimps=1e6),"metal"==a&&(b.mod.prod=0),"trimp"==a&&(b.mod.soldiers=1),"nerfed"==a&&(b.perks.Overkill.max_level=1),"scientist"==a&&(b.perks.Coordinated.max_level=0),"income"==a&&(b.weight={income:3,trimps:3,attack:1,helium:0,health:0,xp:0});var c=game?game.global.highestLevelCleared:999;return a.match(/trimp|coord/)&&b.zone>=c-100&&show_alert("warning","Your target zone seems too high for this c², try lowering it."),"spire"==a&&game&&game.global.world!=100*(2+game.global.lastSpireCleared)&&show_alert("warning","This preset is meant to be used mid-run, when you’re done farming for the Spire."),b}function display(a){var b=a[0],c=a[1],d=game?game.options.menu.smallPerks.enabled:0,e=$("#perks").clientWidth/(5+d);$("#test-text").innerText="Level: "+prettify(12345678)+" (+"+prettify(1234567)+")";var f=e>$("#test-text").clientWidth?"Level: ":"";$("#results").style.opacity="1",$("#info").innerText=localStorage.more?"Less info":"More info",$("#he-left").innerHTML=prettify(b)+" Helium Left Over",$("#perks").innerHTML=Object.keys(c).filter(function(a){return!c[a].locked}).map(function(a){var b=c[a],e=b.level,g=b.max_level,h=game?e-game.portal[a].level:0,i=h?" ("+(h>0?"+":"-")+prettify(abs(h))+")":"",j=h>0?"adding":0>h?"remove":e>=g?"capped":"";return j+=[" large"," small"," tiny"][d],"<div class='perk "+j+" "+localStorage.more+"'>"+("<b>"+a.replace("_"," ")+"</b><br>")+(f+"<b>"+prettify(e)+i+"</b><br><span class=more>")+("Price: "+(e>=g?"∞":prettify(c[a].cost))+"<br>")+("Spent: "+prettify(c[a].spent())+"</span></div>")}).join("");for(var g in c)c[g]=c[g].level;$("#perkstring").innerText=LZString.compressToBase64(JSON.stringify(c))}function main(){display(optimize(parse_inputs()))}function toggle_info(){localStorage.more=localStorage.more?"":"more",$$(".perk").forEach(function(a){return a.classList.toggle("more")}),$("#info").innerText=localStorage.more?"Less info":"More info"}function parse_perks(a,b){var c=function(a){return function(b){return 1+.01*a*b}},d=function(a){return function(b){return pow(1+.01*a,b)}},e={Looting_II:new Perk(1e5,1e4,c(.25)),Carpentry_II:new Perk(1e5,1e4,c(.25)),Motivation_II:new Perk(5e4,1e3,c(1)),Power_II:new Perk(2e4,500,c(1)),Toughness_II:new Perk(2e4,500,c(1)),Capable:new Perk(1e8,0,function(a){return 1},10,10),Cunning:new Perk(1e11,0,c(25)),Curious:new Perk(1e14,0,c(60)),Classy:new Perk(1e17,0,d(3.0225),50),Overkill:new Perk(1e6,0,c(500),30),Resourceful:new Perk(5e4,0,d(-5)),Coordinated:new Perk(15e4,0,d(-2)),Siphonology:new Perk(1e5,0,function(a){return pow(1+a,.1)},3),Anticipation:new Perk(1e3,0,c(6),10),Resilience:new Perk(100,0,d(10)),Meditation:new Perk(75,0,c(1),7),Relentlessness:new Perk(75,0,function(a){return 1+.05*a*(1+.3*a)},10),Carpentry:new Perk(25,0,d(10)),Artisanistry:new Perk(15,0,d(-5)),Range:new Perk(1,0,c(1),10),Agility:new Perk(4,0,d(-5),20),Bait:new Perk(4,0,c(100)),Trumps:new Perk(3,0,c(20)),Pheromones:new Perk(3,0,c(10)),Packrat:new Perk(3,0,c(20)),Motivation:new Perk(2,0,c(5)),Power:new Perk(1,0,c(5)),Toughness:new Perk(1,0,c(5)),Looting:new Perk(1,0,c(5))};b.match(/>/)||(b=b.replace(/(?=,|$)/g,">0"));for(var f=function(a){var b=a.match(/(\S+) *([<=>])=?(.*)/);if(!b)throw"Enter a list of perk levels, such as “power=42, toughness=51”.";var c=b[1].match(/2$|II$/),d=b[1].replace(/[ _]?(2|II)/i,"").replace(/^OK/i,"O").replace(/^Looty/i,"L"),f=new RegExp("^"+d+"[a-z]*"+(c?"_II":"")+"$","i"),g=Object.keys(e).filter(function(a){return a.match(f)});if(g.length>1)throw"Ambiguous perk abbreviation: "+b[1]+".";if(g.length<1)throw"Unknown perk: "+b[1]+".";var h=parse_suffixes(b[3]);if(!isFinite(h))throw"Invalid number: "+b[3]+".";e[g[0]].locked=!1,">"!=b[2]&&(e[g[0]].max_level=h),"<"!=b[2]&&(e[g[0]].min_level=h)},g=0,h=(b+","+a).split(/,/).filter(function(a){return a});g<h.length;g++){var i=h[g];f(i)}return e}function optimize(a){function b(){return 1+ +(S.bonus>.9)+ceil(10*S.bonus)}function c(){return X.bonus*A.bonus*N.bonus}function d(){var a=c()*w.whip,b=ma()*w.magn*.75*.8,d=w.chronojest*a*b/30;return a+b+d}function e(a){var d=w.storage*I.bonus/W.bonus,e=ma()*w.magn/b(),f=a?0:c()*w.prod,g=.1*w.chronojest*f*e;return ha*(f+e*w.loot+g)*(1-d)*na()}function f(a){var b=la[a]*Q.bonus,c=1.136,d=log(1+e()/b)/log(ka.cost);return d>ja+.45&&(c=log(1+.2*pow(ka.cost,d-ja))/log(1.2),d=ja),c*pow(ka[a],d)}function g(a,b){return a*=4*I.bonus,log(1+e(!0)*(b-1)/a)/log(b)}function h(){return max(s-229,0)}function i(){var a=g(2e6,1.06)/(1+.1*min(h(),20)),b=.0085*(s>=60?.1:1)*pow(1.1,floor(s/5));return b*pow(1.01,a)*V.bonus*w.ven}function j(){var a=1+.25*J.bonus,b=(w.soldiers||na())/3;w.soldiers>1&&(b+=36e3*T.bonus);var c=max(0,log(oa[J.level]/b)/log(a));return oa[0]*pow(1.25,-c)}function k(){if(230>s||w.soldiers>1||jobless)return 0;var a=log(na()/oa[J.level])/log(10);return max(0,(a-7+floor((s-215)/100))/3)}function l(){var a=(.15+f("attack"))*pow(.8,h());return a*=Y.bonus*B.bonus*O.bonus,a*=K.bonus*R.bonus*L.bonus,a*=t.attack[D.level],a*=game&&mastery("amalg")?Math.pow(1.5,k()):1+.5*k(),j()*a}function m(){var a=(.6+f("health"))*pow(.8,h());a*=Z.bonus*C.bonus*M.bonus;var c=g(400,1.185),d=jobless?0:(c*log(1.185)-log(1+c))/log(1.1)+25-fa,e=.04*c*pow(1+fa/100,c)*(1+ga*d),l=60;if(70>s||jobless){var m=log(1+j()*i()/T.bonus)/log(1+i());l=m/b()}else{var n=min(oa[J.level]/na(),1/3),o=n>1e-9?10*(pow(.5/(.5-n),.1/w.breed_timer)-1):n/w.breed_timer,p=log(i()/o)/-log(.98);a*=pow(1.01,p),a*=pow(1.332,k())}return a/=l,60>s?e+=f("block"):e=min(e,4*a),j()*(e+a)}function n(){var a=0;for(var b in v)if(v[b]){var c=ya[b]();if(!isFinite(c))throw Error(b+" is "+c);a+=v[b]*log(c)}return a}function o(){var a=n();for(var b in u){var c=u[b];!c.cost_increment&&c.levellable(x)&&(c.level_up(1),c.gain=n()-a,c.level_up(-1))}for(var d=0,e=["Looting","Carpentry","Motivation","Power","Toughness"];d<e.length;d++){var f=e[d];u[f+"_II"].gain=u[f].gain*u[f+"_II"].log_ratio()/u[f].log_ratio()}}function p(a,b,c){var d=b*b-4*a*c;return(-b+sqrt(d))/(2*a)}function q(a,b){if(a.gain/=a.log_ratio(),a.cost_increment){var c=(1+a.level)/(1+y.level+z.level+A.level+B.level+C.level);b*=.5*Math.pow(c,2);var d=p(a.cost_increment/2,a.cost-a.cost_increment/2,-b);x-=a.level_up(floor(max(min(d,a.max_level-a.level),1,a.level/1e12)))}else{b=Math.pow(b,.5);do x-=a.level_up(1);while(a.cost<b&&a.level<a.max_level)}a.gain*=a.log_ratio()}for(var r=a.total_he,s=a.zone,t=a.fluffy,u=a.perks,v=a.weight,w=a.mod,x=r,y=u.Looting_II,z=u.Carpentry_II,A=u.Motivation_II,B=u.Power_II,C=u.Toughness_II,D=u.Capable,E=u.Cunning,F=u.Curious,G=u.Classy,H=u.Overkill,I=u.Resourceful,J=u.Coordinated,K=u.Siphonology,L=u.Anticipation,M=u.Resilience,N=u.Meditation,O=u.Relentlessness,P=u.Carpentry,Q=u.Artisanistry,R=u.Range,S=u.Agility,T=u.Bait,U=u.Trumps,V=u.Pheromones,W=u.Packrat,X=u.Motivation,Y=u.Power,Z=u.Toughness,$=u.Looting,_=0,aa=["whip","magn","taunt","ven"];_<aa.length;_++){var ba=aa[_];w[ba]=pow(1.003,99*s*.03*w[ba])}for(var ca=pow(1.25,s)*pow(s>100?1.28:1.2,max(s-59,0)),da=max(0,min(s-60,s/2-25,s/3-12,s/5,s/10+17,39)),ea=pow(1.25,5+min(s/2,30)+da),fa=s>=25?floor(min(s/5,9+s/25,15)):0,ga=(20+s-s%5)/100,ha=600*w.whip*ca,ia=pow(s-19,2),ja=s/5+ +(5>(s-1)%10),ka={cost:pow(1.069,.85*(60>s?57:53)),attack:pow(1.19,13),health:pow(1.19,14),block:pow(1.19,10)},la={attack:211*(v.attack+v.health)/v.attack,health:248*(v.attack+v.health)/v.health,block:5*(v.attack+v.health)/v.health},ma=function(){return $.bonus*y.bonus},na=w.tent_city?function(){var a=P.bonus*z.bonus,b=U.bonus;return 10*(w.taunt+b*(w.taunt-1)*111)*a}:function(){var a=P.bonus*z.bonus,b=3+log(ea*d()/I.bonus)/log(1.4),c=U.bonus*s;return 10*(ea*b+c)*a*w.taunt+w.dg*a},oa=[],pa=0;pa<=log(1+x/5e5)/log(1.3);++pa){for(var qa=1+.25*pow(.98,pa),ra=s-1+(h()?100:0),sa=1,ta=0;ra>ta;++ta)sa=ceil(sa*qa);oa[pa]=sa}var ua=function(){return E.bonus*F.bonus*G.bonus},va=function(){return 1/S.bonus},wa=function(){return ia*ma()+45},xa=function(){return H.bonus},ya={agility:va,helium:wa,xp:ua,attack:l,health:m,overkill:xa,trimps:na,income:e};w.loot*=20.8,v.agility=(v.helium+v.attack)/2,v.overkill=.25*v.attack*(2-pow(.9,v.helium/v.attack)),s>90&&w.soldiers<=1&&0==T.min_level&&(T.max_level=0),t.attack=[];for(var za=log(.003*t.xp/pow(5,t.prestige)+1)/log(4),Aa=0;10>=Aa;++Aa){var Ba=min(floor(za),Aa),Ca=Ba==Aa?0:(pow(4,za-Ba)-1)/3;t.attack[Aa]=1+.1*pow(5,t.prestige)*(Ba/2+Ca)*(Ba+1)}console.time();for(var Da in u){var Ea=u[Da];if(Ea.cost_increment)x-=Ea.level_up(Ea.min_level);else for(;Ea.level<Ea.min_level;)x-=Ea.level_up(1)}if(s>300&&v.xp>0)for(var qa=.25;D.levellable(x*qa);)x-=D.level_up(1),qa=D.level<=floor(za)?.25:.01;if((300>=s||za>=D.level)&&(v.xp=0),0>x)throw game&&game.global.canRespecPerks?"You don’t have enough Helium to afford your Fixed Perks.":"You don’t have a respec available.";for(var Fa=Object.keys(u).map(function(a){return u[a]}).filter(function(a){return a.levellable(x)}),Ga=.999;Ga>1e-12;Ga*=Ga){var Ha=r*Ga;for(o(),Fa.sort(function(a,b){return b.gain/b.cost-a.gain/a.cost});x>Ha&&Fa.length;){var Ia=Fa.shift();if(Ia.levellable(x)){q(Ia,x-Ha);for(var ta=0;Fa[ta]&&Fa[ta].gain/Fa[ta].cost>Ia.gain/Ia.cost;)ta++;Fa.splice(ta,0,Ia)}}}return r/1e12>x+1&&C.level>0&&(--C.level,x+=C.cost),console.timeEnd(),[x,u]}var abs=Math.abs,ceil=Math.ceil,floor=Math.floor,log=Math.log,max=Math.max,min=Math.min,pow=Math.pow,round=Math.round,sqrt=Math.sqrt,jobless=!1,$=function(a){return document.querySelector(a)},$$=function(a){return[].slice.apply(document.querySelectorAll(a))};$("#dark").disabled=!localStorage.dark;var notations=[[],"KMBTQaQiSxSpOcNoDcUdDdTdQadQidSxdSpdOdNdVUvDvTvQavQivSxvSpvOvNvTgUtgDtgTtgQatgQitgSxtgSptgOtgNtgQaaUqaDqaTqaQaqaQiqaSxqaSpqaOqaNqaQiaUqiDqiTqiQaqiQiqiSxqiSpqiOqiNqiSxaUsxDsxTsxQasxQisxSxsxSpsxOsxNsxSpaUspDspTspQaspQispSxspSpspOspNspOgUogDogTogQaogQiogSxogSpogOogNogNaUnDnTnQanQinSxnSpnOnNnCtUc".split(/(?=[A-Z])/),[],"a b c d e f g h i j k l m n o p q r s t u v w x y z aa ab ac ad ae af ag ah ai aj ak al am an ao ap aq ar as at au av aw ax ay az ba bb bc bd be bf bg bh bi bj bk bl bm bn bo bp bq br bs bt bu bv bw bx by bz ca cb cc cd ce cf cg ch ci cj ck cl cm cn co cp cq cr cs ct cu cv cw cx".split(" "),"KMBTQaQiSxSpOcNoDcUdDdTdQadQidSxdSpdOdNdVUvDvTvQavQivSxvSpvOvNvTg".split(/(?=[A-Z])/)];window.addEventListener("error",function(a){return"string"==typeof a.error?void show_alert("ko",a.error):void("Script error."!=a.message&&create_share(function(b){return show_alert("ko","Oops! It’s not your fault, but something went wrong. You can go pester the dev on\n	<a href=https://github.com/Grimy/Grimy.github.io/issues/new>GitHub</a> or\n	<a href=https://www.reddit.com/message/compose/?to=Grimy_>Reddit</a>, he’ll fix it.\n	If you do, please include the following data:<br>\n	<tt>"+b+"<br>"+a.filename+" l"+(a.lineno||0)+"c"+(a.colno||0)+" "+a.message+"</tt>.")}))});var game;document.addEventListener("DOMContentLoaded",toggle_spoilers),document.addEventListener("DOMContentLoaded",function(){var a="2.4";a>localStorage.version&&show_alert("ok","Welcome to Trimps tools v"+a+"! See what’s new in the <a href=changelog.html>changelog</a>."),localStorage.version=a,location.search&&load_share(location.search.substr(1)),$$("[data-saved]").forEach(function(a){"checkbox"===a.type?(a.checked="true"===localStorage[a.id],a.addEventListener("change",function(){return localStorage[a.id]=a.checked})):(a.value=localStorage[a.id]||a.value,a.addEventListener("change",function(){return localStorage[a.id]=a.value}))})},!1);var Perk=function(){function a(a,b,c,d,e){void 0===d&&(d=1/0),void 0===e&&(e=1.3),this.base_cost=a,this.cost_increment=b,this.scaling=c,this.max_level=d,this.cost_exponent=e,this.locked=!0,this.level=0,this.min_level=0,this.cost=0,this.gain=0,this.bonus=1,this.cost=this.base_cost}return a.prototype.levellable=function(a){return!this.locked&&this.level<this.max_level&&this.cost*max(1,floor(this.level/1e12))<=a},a.prototype.level_up=function(a){if(this.level+=a,this.bonus=this.scaling(this.level),this.cost_increment){var b=a*(this.cost+this.cost_increment*(a-1)/2);return this.cost+=a*this.cost_increment,b}var b=this.cost;return this.cost=ceil(this.level/2+this.base_cost*pow(this.cost_exponent,this.level)),b},a.prototype.spent=function(a){if(void 0===a&&(a=!1),this.cost_increment)return this.level*(this.base_cost+this.cost-this.cost_increment)/2;for(var b=0,c=0;c<this.level;++c)b+=ceil(c/2+this.base_cost*pow(this.cost_exponent,c));return b},a.prototype.log_ratio=function(){return this.cost_increment?(this.scaling(1)-this.scaling(0))/this.bonus:log(this.scaling(this.level+1)/this.bonus)},a}(),presets={early:["5","4","3"],broken:["7","3","1"],mid:["16","5","1"],corruption:["25","7","1"],magma:["35","4","3"],z280:["42","6","1"],z400:["88","10","1"],z450:["500","50","1"],spire:["0","1","1"],nerfed:["0","4","3"],tent:["5","4","3"],scientist:["0","1","3"],carp:["0","0","0"],trapper:["0","7","1"],coord:["0","40","1"],trimp:["0","99","1"],metal:["0","7","1"],c2:["0","7","1"],income:["0","0","0"]};document.addEventListener("DOMContentLoaded",validate_fixed,!1),document.addEventListener("DOMContentLoaded",auto_preset,!1);