//@version=1 // by SMG
study('Cum. Data by Session')
const closed = input("Set Saturday and Sunday as closed session",true)
seq dow = dayofweek(time)
seq wkend = closed& (dow==0 or dow==6)
const cumu = input("Cumulative All Session",true)
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
  case 'Funding Change':
     src = 8
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
seq d = src==1?pc:src==2?v:src==20?vd:src==21?vbuy:src==22?vsell:src==3?oic:src==31?inflow:src==32?-outflow:src==4?bidc+askc:src==41?bidc:src==42?askc:src==5?lbid+lask:src==50?lask-lbid:src==51?lask:src==52?lbid:src==8?funding-funding[1]:na
seq day = floor((time/1000-1576022400)/86400)
//
header('','Anchored Date[Cumulative All Session]')
const to_now = input("From Start to; ☑ - Current time, □ - End",true)
const show_anc = input("Show Anchor Location",true)
header('','Start')
var yy= input("Year",2022)
var mm= input("Month",1,minval=1,maxval=12,step=1)
var da = input("Day",1,minval=1,maxval=31,step=1)
var h = input("Hour",0,minval=0,maxval=23,step=1)
var m = input("Minute",0,minval=0,maxval=59,step=1)
seq ts = timestamp(yy,mm,da,h,m,0)
header('','End')
var yye= input("Year",2022)
var mme= input("Month",6,minval=1,maxval=12,step=1)
var dae = input("Day",1,minval=1,maxval=31,step=1)
var he = input("Hour",0,minval=0,maxval=23,step=1)
var me = input("Minute",0,minval=0,maxval=59,step=1)
seq te = timestamp(yye,mme,dae,he,me,0)

seq t = time
seq cond = to_now ? t >= ts : ts<te? t >= ts & t<te : t >= te & t<ts
bgcolor(cumu&show_anc&time[1]<ts&time>=ts? #FFFFFF70 : na )
bgcolor(to_now==false&cumu&show_anc&time[1]<te&time>=te? #FFFFFF70 : na )
seq dst = (t >= timestamp(2022,3,14,2,0,0) & t < timestamp(2021,11,7,2,0,0))
  or (t >= timestamp(2022,3,13,2,0,0) & t < timestamp(2022,11,6,2,0,0)) //daylight saving time

header("","Session 1")
const caz = input("",true)
const azcol = input("",color.cyan)
const datass1 = input("World Stock Market Hours",'Tokyo Stock Exchange',options=['Custom','New York Stock Exchange (NYSE)','Nasdaq Stock Market','Toronto Stock Exchange (TSX)',
                                                                          'Shanghai Stock Exchange (SSE)','Tokyo Stock Exchange','Shenzhen Stock Exchange (SZSE)','Stock Exchange of Hong Kong (SEHK)','National Stock Exchange of India (NSE)','Saudi Stock Exchange','BSE Limited','Korea Exchange (KRX)', 'Taiwan Stock Exchange (TWSE)',
                                                                          'London Stock Exchange','Frankfurt Stock Exchange','SIX Swiss Exchange','Euronext Amsterdam','Nasdaq Stockholm AB',
                                                                          'B3 S.A.','Australian Securities Exchange (ASX)','Johannesburg Stock Exchange (JSE)'])
seq ss1 = 0 
switch(datass1){
  case 'Custom':
     ss1 = 0
     break
  case 'New York Stock Exchange (NYSE)':
     ss1 = 10
     break
  case 'Nasdaq Stock Market':
     ss1 = 11
     break
  case 'Toronto Stock Exchange (TSX)':
     ss1 = 12
     break
  case 'Shanghai Stock Exchange (SSE)':
     ss1 = 20
     break
  case 'Tokyo Stock Exchange':
     ss1 = 21
     break
  case 'Shenzhen Stock Exchange (SZSE)':
     ss1 = 22
     break
  case 'Stock Exchange of Hong Kong (SEHK)':
     ss1 = 23
     break
  case 'National Stock Exchange of India (NSE)':
     ss1 = 24
     break
  case 'Saudi Stock Exchange':
     ss1 = 25
     break
  case 'BSE Limited':
     ss1 = 26
     break
  case 'Korea Exchange (KRX)':
     ss1 = 27
     break
  case 'Taiwan Stock Exchange (TWSE)':
     ss1 = 28
     break
  case 'London Stock Exchange':
     ss1 = 30
     break
  case 'Frankfurt Stock Exchange':
     ss1 = 31
     break
  case 'SIX Swiss Exchange':
     ss1 = 32
     break
  case 'Euronext Amsterdam':
     ss1 = 33
     break
  case 'Nasdaq Stockholm AB':
     ss1 = 34
     break
  case 'B3 S.A.':
     ss1 = 4
     break
  case 'Australian Securities Exchange (ASX)':
     ss1 = 5
     break
  case 'Johannesburg Stock Exchange (JSE)':
     ss1 = 6
     break
}
var azop = input("Session Open[Custom]",0)
var azcl = input("Session Close[Custom]",8)
seq op1 = ss1==0?azop:ss1==10?dst?13.5:14.5:ss1==11?dst?13.5:14.5:ss1==12?dst?13.5:14.5:
  ss1==20?1.5:ss1==21?0:ss1==22?1.5:ss1==23?1.5:ss1==24?3.75:ss1==25?13:ss1==26?3.75:ss1==27?0:ss1==28?1.25:
  ss1==30?dst?7:8:ss1==31?dst?7:9:ss1==32?dst?7:9:ss1==33?dst?7:9:ss1==34?dst?7:9:
  ss1==4?13:ss1==5?-1:ss1==6?7:azop
seq cl1 = ss1==0?azcl:ss1==10?dst?20:21:ss1==11?dst?20:21:ss1==12?dst?20:21:
  ss1==20?7:ss1==21?6:ss1==22?7:ss1==23?8:ss1==24?10:ss1==25?18:ss1==26?10:ss1==27?6.5:ss1==28?5.5:
  ss1==30?dst?15.5:16.5:ss1==31?dst?15.5:16.5:ss1==32?dst?15.33:16.33:ss1==33?dst?15.5:16.5:ss1==34?dst?15.4167:16.4167:
  ss1==4?21:ss1==5?5:ss1==6?15:azcl
seq azo = floor((time/1000-1576022400+3600*(24-op1))/86400)
seq azc = floor((time/1000-1576022400+3600*((24)-cl1))/86400)
var az = day!=azo and day==azc 
//
header("","Session 2")
const ceu = input("",true)
const eucol = input("",color.lime)
const datass2 = input("World Stock Market Hours",'London Stock Exchange',options=['Custom','New York Stock Exchange (NYSE)','Nasdaq Stock Market','Toronto Stock Exchange (TSX)',
                                                                          'Shanghai Stock Exchange (SSE)','Tokyo Stock Exchange','Shenzhen Stock Exchange (SZSE)','Stock Exchange of Hong Kong (SEHK)','National Stock Exchange of India (NSE)','Saudi Stock Exchange','BSE Limited','Korea Exchange (KRX)', 'Taiwan Stock Exchange (TWSE)',
                                                                          'London Stock Exchange','Frankfurt Stock Exchange','SIX Swiss Exchange','Euronext Amsterdam','Nasdaq Stockholm AB',
                                                                          'B3 S.A.','Australian Securities Exchange (ASX)','Johannesburg Stock Exchange (JSE)'])
seq ss2 = 0 
switch(datass2){
  case 'Custom':
     ss2 = 0
     break
  case 'New York Stock Exchange (NYSE)':
     ss2 = 10
     break
  case 'Nasdaq Stock Market':
     ss2 = 11
     break
  case 'Toronto Stock Exchange (TSX)':
     ss2 = 12
     break
  case 'Shanghai Stock Exchange (SSE)':
     ss2 = 20
     break
  case 'Tokyo Stock Exchange':
     ss2 = 21
     break
  case 'Shenzhen Stock Exchange (SZSE)':
     ss2 = 22
     break
  case 'Stock Exchange of Hong Kong (SEHK)':
     ss2 = 23
     break
  case 'National Stock Exchange of India (NSE)':
     ss2 = 24
     break
  case 'Saudi Stock Exchange':
     ss2 = 25
     break
  case 'BSE Limited':
     ss2 = 26
     break
  case 'Korea Exchange (KRX)':
     ss2 = 27
     break
  case 'Taiwan Stock Exchange (TWSE)':
     ss2 = 28
     break
  case 'London Stock Exchange':
     ss2 = 30
     break
  case 'Frankfurt Stock Exchange':
     ss2 = 31
     break
  case 'SIX Swiss Exchange':
     ss2 = 32
     break
  case 'Euronext Amsterdam':
     ss2 = 33
     break
  case 'Nasdaq Stockholm AB':
     ss2 = 34
     break
  case 'B3 S.A.':
     ss2 = 4
     break
  case 'Australian Securities Exchange (ASX)':
     ss2 = 5
     break
  case 'Johannesburg Stock Exchange (JSE)':
     ss2 = 6
     break
}
var euop = input("Session Open[Custom]",8)
var eucl = input("Session Close[Custom]",16)
seq op2 = ss2==0?euop:ss2==10?dst?13.5:14.5:ss2==11?dst?13.5:14.5:ss2==12?dst?13.5:14.5:
  ss2==20?1.5:ss2==21?0:ss2==22?1.5:ss2==23?1.5:ss2==24?3.75:ss2==25?13:ss2==26?3.75:ss2==27?0:ss2==28?1.25:
  ss2==30?dst?7:8:ss2==31?dst?7:9:ss2==32?dst?7:9:ss2==33?dst?7:9:ss2==34?dst?7:9:
  ss2==4?13:ss2==5?-1:ss2==6?7:euop
seq cl2 = ss2==0?eucl:ss2==10?dst?20:21:ss2==11?dst?20:21:ss2==12?dst?20:21:
  ss2==20?7:ss2==21?6:ss2==22?7:ss2==23?8:ss2==24?10:ss2==25?18:ss2==26?10:ss2==27?6.5:ss2==28?5.5:
  ss2==30?dst?15.5:16.5:ss2==31?dst?15.5:16.5:ss2==32?dst?15.33:16.33:ss2==33?dst?15.5:16.5:ss2==34?dst?15.4167:16.4167:
  ss2==4?21:ss2==5?5:ss2==6?15:eucl
seq euo = floor((time/1000-1576022400+3600*(24-op2))/86400)
seq euc = floor((time/1000-1576022400+3600*((24)-cl2))/86400)
var eu = day!=euo and day==euc
//
header("","Session 3")
const cny = input("",true)
const nycol = input("",color.orange)
const datass3 = input("World Stock Market Hours",'New York Stock Exchange (NYSE)',options=['Custom','New York Stock Exchange (NYSE)','Nasdaq Stock Market','Toronto Stock Exchange (TSX)',
                                                                          'Shanghai Stock Exchange (SSE)','Tokyo Stock Exchange','Shenzhen Stock Exchange (SZSE)','Stock Exchange of Hong Kong (SEHK)','National Stock Exchange of India (NSE)','Saudi Stock Exchange','BSE Limited','Korea Exchange (KRX)', 'Taiwan Stock Exchange (TWSE)',
                                                                          'London Stock Exchange','Frankfurt Stock Exchange','SIX Swiss Exchange','Euronext Amsterdam','Nasdaq Stockholm AB',
                                                                          'B3 S.A.','Australian Securities Exchange (ASX)','Johannesburg Stock Exchange (JSE)'])
seq ss3 = 0 
switch(datass3){
  case 'Custom':
     ss3 = 0
     break
  case 'New York Stock Exchange (NYSE)':
     ss3 = 10
     break
  case 'Nasdaq Stock Market':
     ss3 = 11
     break
  case 'Toronto Stock Exchange (TSX)':
     ss3 = 12
     break
  case 'Shanghai Stock Exchange (SSE)':
     ss3 = 20
     break
  case 'Tokyo Stock Exchange':
     ss3 = 21
     break
  case 'Shenzhen Stock Exchange (SZSE)':
     ss3 = 22
     break
  case 'Stock Exchange of Hong Kong (SEHK)':
     ss3 = 23
     break
  case 'National Stock Exchange of India (NSE)':
     ss3 = 24
     break
  case 'Saudi Stock Exchange':
     ss3 = 25
     break
  case 'BSE Limited':
     ss3 = 26
     break
  case 'Korea Exchange (KRX)':
     ss3 = 27
     break
  case 'Taiwan Stock Exchange (TWSE)':
     ss3 = 28
     break
  case 'London Stock Exchange':
     ss3 = 30
     break
  case 'Frankfurt Stock Exchange':
     ss3 = 31
     break
  case 'SIX Swiss Exchange':
     ss3 = 32
     break
  case 'Euronext Amsterdam':
     ss3 = 33
     break
  case 'Nasdaq Stockholm AB':
     ss3 = 34
     break
  case 'B3 S.A.':
     ss3 = 4
     break
  case 'Australian Securities Exchange (ASX)':
     ss3 = 5
     break
  case 'Johannesburg Stock Exchange (JSE)':
     ss3 = 6
     break
}
var nyop = input("Session Open[Custom]",16)
var nycl = input("Session Close[Custom]",24)
seq op3 = ss3==0?nyop:ss3==10?dst?13.5:14.5:ss3==11?dst?13.5:14.5:ss3==12?dst?13.5:14.5:
  ss3==20?1.5:ss3==21?0:ss3==22?1.5:ss3==23?1.5:ss3==24?3.75:ss3==25?13:ss3==26?3.75:ss3==27?0:ss3==28?1.25:
  ss3==30?dst?7:8:ss3==31?dst?7:9:ss3==32?dst?7:9:ss3==33?dst?7:9:ss3==34?dst?7:9:
  ss3==4?13:ss3==5?-1:ss3==6?7:nyop
seq cl3 = ss3==0?nycl:ss3==10?dst?20:21:ss3==11?dst?20:21:ss3==12?dst?20:21:
  ss3==20?7:ss3==21?6:ss3==22?7:ss3==23?8:ss3==24?10:ss3==25?18:ss3==26?10:ss3==27?6.5:ss3==28?5.5:
  ss3==30?dst?15.5:16.5:ss3==31?dst?15.5:16.5:ss3==32?dst?15.33:16.33:ss3==33?dst?15.5:16.5:ss3==34?dst?15.4167:16.4167:
  ss3==4?21:ss3==5?5:ss3==6?15:nycl
seq nyo = floor((time/1000-1576022400+3600*(24-op3))/86400)
seq nyc = floor((time/1000-1576022400+3600*((24)-cl3))/86400)
var ny = day!=nyo and day==nyc
//
header("","Closed Session")
const ccl = input("",false)
const clcol = input("",color.white)
const datass4 = input("World Stock Market Hours",'Custom',options=['Custom','New York Stock Exchange (NYSE)','Nasdaq Stock Market','Toronto Stock Exchange (TSX)',
                                                                          'Shanghai Stock Exchange (SSE)','Tokyo Stock Exchange','Shenzhen Stock Exchange (SZSE)','Stock Exchange of Hong Kong (SEHK)','National Stock Exchange of India (NSE)','Saudi Stock Exchange','BSE Limited','Korea Exchange (KRX)', 'Taiwan Stock Exchange (TWSE)',
                                                                          'London Stock Exchange','Frankfurt Stock Exchange','SIX Swiss Exchange','Euronext Amsterdam','Nasdaq Stockholm AB',
                                                                          'B3 S.A.','Australian Securities Exchange (ASX)','Johannesburg Stock Exchange (JSE)'])
seq ss4 = 0 
switch(datass4){
  case 'Custom':
     ss4 = 0
     break
  case 'New York Stock Exchange (NYSE)':
     ss4 = 10
     break
  case 'Nasdaq Stock Market':
     ss4 = 11
     break
  case 'Toronto Stock Exchange (TSX)':
     ss4 = 12
     break
  case 'Shanghai Stock Exchange (SSE)':
     ss4 = 20
     break
  case 'Tokyo Stock Exchange':
     ss4 = 21
     break
  case 'Shenzhen Stock Exchange (SZSE)':
     ss4 = 22
     break
  case 'Stock Exchange of Hong Kong (SEHK)':
     ss4 = 23
     break
  case 'National Stock Exchange of India (NSE)':
     ss4 = 24
     break
  case 'Saudi Stock Exchange':
     ss4 = 25
     break
  case 'BSE Limited':
     ss4 = 26
     break
  case 'Korea Exchange (KRX)':
     ss4 = 27
     break
  case 'Taiwan Stock Exchange (TWSE)':
     ss4 = 28
     break
  case 'London Stock Exchange':
     ss4 = 30
     break
  case 'Frankfurt Stock Exchange':
     ss4 = 31
     break
  case 'SIX Swiss Exchange':
     ss4 = 32
     break
  case 'Euronext Amsterdam':
     ss4 = 33
     break
  case 'Nasdaq Stockholm AB':
     ss4 = 34
     break
  case 'B3 S.A.':
     ss4 = 4
     break
  case 'Australian Securities Exchange (ASX)':
     ss4 = 5
     break
  case 'Johannesburg Stock Exchange (JSE)':
     ss4 = 6
     break
}
var clop = input("Session Open[Custom]",24)
var clcl = input("Session Close[Custom]",24)
seq op4 = ss4==0?clop:ss4==10?dst?13.5:14.5:ss4==11?dst?13.5:14.5:ss4==12?dst?13.5:14.5:
  ss4==20?1.5:ss4==21?0:ss4==22?1.5:ss4==23?1.5:ss4==24?3.75:ss4==25?13:ss4==26?3.75:ss4==27?0:ss4==28?1.25:
  ss4==30?dst?7:8:ss4==31?dst?7:9:ss4==32?dst?7:9:ss4==33?dst?7:9:ss4==34?dst?7:9:
  ss4==4?13:ss4==5?-1:ss4==6?7:clop
seq cl4 = ss4==0?clcl:ss4==10?dst?20:21:ss4==11?dst?20:21:ss4==12?dst?20:21:
  ss4==20?7:ss4==21?6:ss4==22?7:ss4==23?8:ss4==24?10:ss4==25?18:ss4==26?10:ss4==27?6.5:ss4==28?5.5:
  ss4==30?dst?15.5:16.5:ss4==31?dst?15.5:16.5:ss4==32?dst?15.33:16.33:ss4==33?dst?15.5:16.5:ss4==34?dst?15.4167:16.4167:
  ss4==4?21:ss4==5?5:ss4==6?15:clcl
seq clo = floor((time/1000-1576022400+3600*(24-op4))/86400)
seq clc = floor((time/1000-1576022400+3600*((24)-cl4))/86400)
var cl = day!=clo and day==clc
//
seq azd = wkend?0:cond&az?d:0
seq eud = wkend?0:cond&eu?d:0
seq nyd = wkend?0:cond&ny?d:0
seq cld = cond&wkend?d:cond&cl?d:0
plot(cumu?caz?cum(azd):na:na,linewidth=2,color=azcol)
plot(cumu?ceu?cum(eud):na:na,linewidth=2,color=eucol)
plot(cumu?cny?cum(nyd):na:na,linewidth=2,color=nycol)
plot(cumu?ccl?cum(cld):na:na,linewidth=2,color=clcol)
//
global cazd = 0
global ceud = 0
global cnyd = 0
global ccld = 0
global cd = 0
cazd = wkend?barstate.isrealtime?na:0:az ?  barstate.isrealtime ? cazd : cazd + d : 0
ceud = wkend?barstate.isrealtime?na:0:eu ?  barstate.isrealtime ? ceud : ceud + d : 0
cnyd = wkend?barstate.isrealtime?na:0:ny ?  barstate.isrealtime ? cnyd : cnyd + d : 0
ccld = cl ?  barstate.isrealtime ? ccld : ccld + d : 0
cd = wkend ?  barstate.isrealtime ? cd : cd + d : 0
plot(cumu==false&caz?az?barstate.isrealtime ? cazd+d: cazd:0:na,linewidth=2,color=azcol)
plot(cumu==false&ceu?eu?barstate.isrealtime ? ceud+d: ceud:0:na,linewidth=2,color=eucol)
plot(cumu==false&cny?ny?barstate.isrealtime ? cnyd+d: cnyd:0:na,linewidth=2,color=nycol)
plot(cumu==false&ccl?wkend?barstate.isrealtime ? cd : cd + d:cl?barstate.isrealtime ? ccld+d: ccld:0:na,linewidth=2,color=clcol)