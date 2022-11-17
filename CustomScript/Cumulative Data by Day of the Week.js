//@version=1 // by SMG

study("Cum. Data by DOW")
const cumu = input("Cumulative",true)
seq t = dayofweek(time)
const dataSrc = input("Metrics", '1.Price ROC', options=['1.Price ROC','2.Volume','┣ Volume(Delta)','┣ Volume(Buy)','┗ Volume(Sell)','3.Open Interest ROC','┣ Open Interest ROC(Inflow)','┗ Open Interest ROC(Outflow)','4.Liquidity ROC','┣ Liquidity ROC(Bid)','┗ Liquidity ROC(Ask)','5.Liquidation','┣ Liquidation(Delta)','┣ Liquidation(Ask)','┗ Liquidation(Bid)'])
seq src = 1
switch(dataSrc){
  case '1.Price ROC':
     src = 1
     break
  case '2.Volume':
     src = 2
     break
  case '┣ Volume(Delta)':
     src = 20
     break
  case '┣ Volume(Buy)':
     src = 21
     break
  case '┗ Volume(Sell)':
     src = 22
     break
   case '3.Open Interest ROC':
     src = 3
     break
  case '┣ Open Interest ROC(Inflow)':
     src = 31
     break
  case '┗ Open Interest ROC(Outflow)':
     src = 32
     break
  case '4.Liquidity ROC':
     src = 4
     break
  case '┣ Liquidity ROC(Bid)':
     src = 41
     break
  case '┗ Liquidity ROC(Ask)':
     src = 42
     break
  case '5.Liquidation':
     src = 5
     break
  case '┣ Liquidation(Delta)':
     src = 50
     break
  case '┣ Liquidation(Ask)':
     src = 51
     break
  case '┗ Liquidation(Bid)':
     src = 52
     break
}
seq pc = (close-close[1])/close[1]
seq v = vbuy+vsell
seq vd = vbuy-vsell
seq oic = (oi_close-oi_close[1])/oi_close[1]
seq inflow = oic>0?oic:0
seq outflow = oic>0?0:oic
const dom = input("Depth[4.Liquidity ROC]",20,minval=0,maxval=100,step=0.1)
seq bid = bid_sum(dom)
seq ask = ask_sum(dom)
seq bidc = (bid-bid[1])/bid[1]
seq askc = (ask-ask[1])/ask[1]
seq lbid = liq_bid
seq lask = liq_ask
seq d = src==1?pc:src==2?v:src==20?vd:src==21?vbuy:src==22?vsell:src==3?oic:src==31?inflow:src==32?-outflow:src==4?bidc+askc:src==41?bidc:src==42?askc:src==5?lbid+lask:src==50?lask-lbid:src==51?lask:src==52?lbid:na
//
header('','Anchored Date[Cumulative]')
var yy= input("Year",2022)
var mm= input("Month",1)
var da = input("Day",1)
var h = input("Hour",0)
var m = input("Minute",0)
seq ts = timestamp(yy,mm,da,h,m,0)
seq cond = time >= ts

const show_anc = input("Show Anchor Location",true)
bgcolor(show_anc&time==ts? #FFFFFF70 : na )

header('')
header('')
const mond = input("Monday",true)
var monc = input("", color.yellow)
seq mon = cond&t==1?d:0
//
header('')
const tued = input("Tuesday",true)
var tuec = input("", color.magenta)
seq tue = cond&t==2?d:0
//header('')
header('')
const wedd = input("Wednesday",true)
var wedc = input("", color.lime)
seq wed = cond&t==3?d:0
//
header('')
const thud = input("Thursday",true)
var thuc = input("", color.orange)
seq thu = cond&t==4?d:0
//
header('')
const frid = input("Friday",true)
var fric = input("", #00FFFFFF)
seq fri = cond&t==5?d:0
//
header('')
const satd = input("Saturday",true)
var satc = input("", #7000FFFF)
seq sat = cond&t==6?d:0
//
header('')
const sund = input("Sunday",true)
var sunc = input("", color.red)
seq sun = cond&t==0?d:0

plot(cumu&mond?cum(mon):na,linewidth=2,color=monc)
plot(cumu&tued?cum(tue):na,linewidth=2,color=tuec)
plot(cumu&wedd?cum(wed):na,linewidth=2,color=wedc)
plot(cumu&thud?cum(thu):na,linewidth=2,color=thuc)
plot(cumu&frid?cum(fri):na,linewidth=2,color=fric)
plot(cumu&satd?cum(sat):na,linewidth=2,color=satc)
plot(cumu&sund?cum(sun):na,linewidth=2,color=sunc)

//
global cmond = 0
global ctued = 0
global cwedd = 0
global cthud = 0
global cfrid = 0
global csatd = 0
global csund = 0
cmond = mon ?  barstate.isrealtime ? cmond : cmond + d : 0
ctued = tue ?  barstate.isrealtime ? ctued : ctued + d : 0
cwedd = wed ?  barstate.isrealtime ? cwedd : cwedd + d : 0
cthud = thu ?  barstate.isrealtime ? cthud : cthud + d : 0
cfrid = fri ?  barstate.isrealtime ? cfrid : cfrid + d : 0
csatd = sat ?  barstate.isrealtime ? csatd : csatd + d : 0
csund = sun ?  barstate.isrealtime ? csund : csund + d : 0
plot(cumu==false&mond?cmond:na,linewidth=2,color=monc)
plot(cumu==false&tued?ctued:na,linewidth=2,color=tuec)
plot(cumu==false&wedd?cwedd:na,linewidth=2,color=wedc)
plot(cumu==false&thud?cthud:na,linewidth=2,color=thuc)
plot(cumu==false&frid?cfrid:na,linewidth=2,color=fric)
plot(cumu==false&satd?csatd:na,linewidth=2,color=satc)
plot(cumu==false&sund?csund:na,linewidth=2,color=sunc)
