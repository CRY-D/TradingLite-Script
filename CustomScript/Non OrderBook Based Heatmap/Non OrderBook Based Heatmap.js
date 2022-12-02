//@version=1 //by SMG
study("Non Orderbook-based Heatmap",overlay=true)
header('Configs:','DataSource')
const dataSrc=input("DataSource",'hl2',options=['open','high','low','close','ohlc4','hlc3','hl2','high/low','hc2/lc2'])
seq src=close
switch(dataSrc){
  case'open':
     src=open
     break
  case'high':
     src=high
     break
  case'low':
     src=low
     break
  case'close':
     src=close
     break
  case'ohlc4':
     src=ohlc4
     break
  case'hlc3':
     src=hlc3
     break
  case'hl2':
     src=hl2
     break
  case'high/low':
     src=close>close[1]?high:low
     break
  case'hc2/lc2':
     src=close>close[1]?(high+close)/2:(low+close)/2
     break
}


//
const dataMetrics=input("Data (Metrics)",'3.Open Interest ROC',options=['1.Price ROC','2.Volume','┣Volume(Delta)','┣Volume(Buy)','┗Volume(Sell)','3.Open Interest ROC','┣Open Interest ROC(Inflow)','┗Open Interest ROC(Outflow)','4.Liquidity ROC','┣Liquidity ROC(Bid)','┗Liquidity ROC(Ask)','5.Liquidation','┣Liquidation(Delta)','┣Liquidation(Ask)','┗Liquidation(Bid)'])
seq metrics=1
switch(dataMetrics){
  case'1.PriceROC':
     metrics=1
     break
  case'2.Volume':
     metrics=2
     break
  case'┣Volume(Delta)':
     metrics=20
     break
  case'┣Volume(Buy)':
     metrics=21
     break
  case'┗Volume(Sell)':
     metrics=22
     break
  case'3.Open Interest ROC':
     metrics=3
     break
  case'┣Open Interest ROC(Inflow)':
     metrics=31
     break
  case'┗Open Interest ROC(Outflow)':
     metrics=32
     break
  case'4.Liquidity ROC':
     metrics=4
     break
  case'┣Liquidity ROC(Bid)':
     metrics=41
     break
  case'┗Liquidity ROC(Ask)':
     metrics=42
     break
  case'5.Liquidation':
     metrics=5
     break
  case'┣Liquidation(Delta)':
     metrics=50
     break
  case'┣Liquidation(Ask)':
     metrics=51
     break
  case'┗Liquidation(Bid)':
     metrics=52
     break
}
seq oisrc=oi_close
const dom=input("Depth[4.Liquidity ROC]",20,minval=0,maxval=100,step=0.1)
seq 
  pc=(close-close[1])/close[1],
  v=vbuy+vsell,
  vd=vbuy-vsell,
  oic=(oisrc-oisrc[1])/oisrc[1],
  inflow=oic>0?oic:0,
  outflow=oic>0?0:oic,
  bid=bid_sum(dom),
  ask=ask_sum(dom),
  bidc=(bid-bid[1])/bid[1],
  askc=(ask-ask[1])/ask[1],
  lbid=liq_bid,
  lask=liq_ask,
  ltotal = lask+lbid,
  ld = lask-lbid
  
seq type=
  metrics==1?pc:
  metrics==2?v:metrics==20?vd:metrics==21?vbuy:metrics==22?vsell:
  metrics==3?oic:metrics==31?inflow:metrics==32?-outflow:
  metrics==4?bidc+askc:metrics==41?bidc:metrics==42?askc:
  metrics==5?ltotal:metrics==50?ld:metrics==51?lask:metrics==52?lbid
  :na

//
header('','')
const dataHLSrc=input("Data Source(Scale Range)",'Auto(Lookback Period)',options=['Auto(Lookback Period)','Custom'])
seq hlsrc=1
switch(dataHLSrc){
  case'Auto(Lookback Period)':
     hlsrc=1
     break
  case'Custom':
     hlsrc=2
     break
}
const customhigh=input('High[Custom]',0), customlow=input('Low[Custom]',0)
const length=input("Custom Period",300)

const latest=input("Display only the latest Lookback period",true)
seq bars=8.64e7*timeframe/1440*(length+1)
seq t=timenow()-time
seq cond=t<=bars



header('','')
const row=input('Number of Rows',48,minval=1,maxval=60,step=1)

header('Color','Heatmap Intensity')
const dataHM=input("Heatmap Intensity",'Custom',options=['Custom'])

const minvalue=input("Intensity Min[Custom]",0.00)
const maxvalue=input("Intensity Peak[Custom]",0.01)

header('','Color')
const dataGradient=input("Theme",'Thermovision🔥',options=['Tradinglite','Next🚔','Thermovision🔥'])
seq grad=2
switch(dataGradient){
  case'Tradinglite':
     grad=1
     break
  case'Next🚔':
     grad=2
     break
  case'Thermovision🔥':
     grad=3
     break
}
//
seq
  h_=hlsrc==1?highest(src,length):customhigh,
  l_=hlsrc==1?lowest(src,length):customlow,
  devid=(h_-l_)/row
//
func heatmap(n:var){
   seq data=latest?cond?type:0:type
   var l=length+1
   var acc_=0
   var acc_d=0.0
   for(i=0;i<l;i++){
      acc_=(l_+devid*(n-1))<src[i]&(l_+devid*(n))>src[i]&h_>=src[i]?data[i]:0
      acc_d=acc_d+acc_
   }
   seq heatmap_=acc_d
   return heatmap_
}
//

//heatmap color
const transp_ = input('Transparency(%)',30,minval=0,maxval=100,step=1), transp = transp_/100
//
func color_heatmap(n:var){
   seq min_=minvalue, max_=maxvalue
   seq unit=(max_-min_)/17
   seq color=
      heatmap(n)>=max_                                ?grad==1?blend(#FFFF00FF,#FFFF0000,transp):grad==2?blend(#A50F15FF,#A50F1500,transp):blend(#FFFDE2FF,#FFFDE200,transp):
      heatmap(n)<max_        &heatmap(n)>=max_-unit   ?grad==1?blend(#E3EE1BFF,#E3EE1B00,transp):grad==2?blend(#BD301FFF,#BD301F00,transp):blend(#FFF177FF,#FFF17700,transp):
      heatmap(n)<max_-unit   &heatmap(n)>=max_-unit*2 ?grad==1?blend(#C9DE20FF,#C9DE2000,transp):grad==2?blend(#D4522AFF,#D4522A00,transp):blend(#FFDE1BFF,#FFDE1B00,transp):
      heatmap(n)<max_-unit*2 &heatmap(n)>=max_-unit*3 ?grad==1?blend(#C9DE20FF,#C9DE2000,transp):grad==2?blend(#EC7434FF,#EC743400,transp):blend(#FEC600FF,#FEC60000,transp):
      heatmap(n)<max_-unit*3 &heatmap(n)>=max_-unit*4 ?grad==1?blend(#8BD050FF,#8BD05000,transp):grad==2?blend(#FE9545FF,#FE954500,transp):blend(#FDA800FF,#FDA80000,transp):
      heatmap(n)<max_-unit*4 &heatmap(n)>=max_-unit*5 ?grad==1?blend(#73D055FF,#73D05500,transp):grad==2?blend(#FEB468FF,#FEB46800,transp):blend(#F88900FF,#F8890000,transp):
      heatmap(n)<max_-unit*5 &heatmap(n)>=max_-unit*6 ?grad==1?blend(#3CBB75FF,#3CBB7500,transp):grad==2?blend(#FFD28BFF,#FFD28800,transp):blend(#F26C01FF,#F26C0100,transp):
      heatmap(n)<max_-unit*6 &heatmap(n)>=max_-unit*7 ?grad==1?blend(#39A764FF,#39A76400,transp):grad==2?blend(#FFF0AEFF,#FFF0AE00,transp):blend(#EB520AFF,#EB520A00,transp):
      heatmap(n)<max_-unit*7 &heatmap(n)>=max_-unit*8 ?grad==1?blend(#209B7FFF,#209B7F00,transp):grad==2?blend(#FFF0AEFF,#FFF0AE00,transp):blend(#EB520AFF,#EB520A00,transp):
      heatmap(n)<max_-unit*8 &heatmap(n)>=max_-unit*9 ?grad==1?blend(#1D8C73FF,#1D8C7300,transp):grad==2?blend(#E6F6C0FF,#E6F6C000,transp):blend(#DF363DFF,#DF363D00,transp):
      heatmap(n)<max_-unit*9 &heatmap(n)>=max_-unit*10?grad==1?blend(#207174FF,#20717400,transp):grad==2?blend(#80CFC3FF,#80CFC300,transp):blend(#CF197BFF,#CF197B00,transp):
      heatmap(n)<max_-unit*10&heatmap(n)>=max_-unit*11?grad==1?blend(#2D6583FF,#2D658300,transp):grad==2?blend(#4DBBC4FF,#4DBBC400,transp):blend(#BC0593FF,#BC059300,transp):
      heatmap(n)<max_-unit*11&heatmap(n)>=max_-unit*12?grad==1?blend(#39568CFF,#39568C00,transp):grad==2?blend(#3B9CBBFF,#3B9CBB00,transp):blend(#9F009BFF,#9F009B00,transp):
      heatmap(n)<max_-unit*12&heatmap(n)>=max_-unit*13?grad==1?blend(#453781FF,#45378100,transp):grad==2?blend(#3479AEFF,#3479AE00,transp):blend(#71009DFF,#71009D00,transp):
      heatmap(n)<max_-unit*13&heatmap(n)>=max_-unit*14?grad==1?blend(#481567FF,#48156700,transp):grad==2?blend(#2C57A1FF,#2C57A100,transp):blend(#420095FF,#42009500,transp):
      heatmap(n)<max_-unit*14&heatmap(n)>=max_-unit*15?grad==1?blend(#351451FF,#35145100,transp):grad==2?blend(#253494FF,#25349400,transp):blend(#100078FF,#10007800,transp):
      heatmap(n)<max_-unit*15&heatmap(n)>=max_-unit*16?grad==1?blend(#30124BFF,#30124B00,transp):grad==2?blend(#030303FF,#03030300,transp):blend(#00002EFF,#00002E00,transp):
      blend(#0E0A1DFF,#0E0A1D00,transp)  
  return color
}


func locate_heatmap(n:var){
   seq locate_heatmap_=0
   if(n<=row+1){
      locate_heatmap_=l_+(devid*(n-1))
   }
   else locate_heatmap_=na
   return locate_heatmap_
}


fill(locate_heatmap(1),locate_heatmap(2),color=color_heatmap(1))
fill(locate_heatmap(2),locate_heatmap(3),color=color_heatmap(2))
fill(locate_heatmap(3),locate_heatmap(4),color=color_heatmap(3))
fill(locate_heatmap(4),locate_heatmap(5),color=color_heatmap(4))
fill(locate_heatmap(5),locate_heatmap(6),color=color_heatmap(5))
fill(locate_heatmap(6),locate_heatmap(7),color=color_heatmap(6))
fill(locate_heatmap(7),locate_heatmap(8),color=color_heatmap(7))
fill(locate_heatmap(8),locate_heatmap(9),color=color_heatmap(8))
fill(locate_heatmap(9),locate_heatmap(10),color=color_heatmap(9))
fill(locate_heatmap(10),locate_heatmap(11),color=color_heatmap(10))
fill(locate_heatmap(11),locate_heatmap(12),color=color_heatmap(11))
fill(locate_heatmap(12),locate_heatmap(13),color=color_heatmap(12))
fill(locate_heatmap(13),locate_heatmap(14),color=color_heatmap(13))
fill(locate_heatmap(14),locate_heatmap(15),color=color_heatmap(14))
fill(locate_heatmap(15),locate_heatmap(16),color=color_heatmap(15))
fill(locate_heatmap(16),locate_heatmap(17),color=color_heatmap(16))
fill(locate_heatmap(17),locate_heatmap(18),color=color_heatmap(17))
fill(locate_heatmap(18),locate_heatmap(19),color=color_heatmap(18))
fill(locate_heatmap(19),locate_heatmap(20),color=color_heatmap(19))
fill(locate_heatmap(20),locate_heatmap(21),color=color_heatmap(20))
fill(locate_heatmap(21),locate_heatmap(22),color=color_heatmap(21))
fill(locate_heatmap(22),locate_heatmap(23),color=color_heatmap(22))
fill(locate_heatmap(23),locate_heatmap(24),color=color_heatmap(23))
fill(locate_heatmap(24),locate_heatmap(25),color=color_heatmap(24))
fill(locate_heatmap(25),locate_heatmap(26),color=color_heatmap(25))
fill(locate_heatmap(26),locate_heatmap(27),color=color_heatmap(26))
fill(locate_heatmap(27),locate_heatmap(28),color=color_heatmap(27))
fill(locate_heatmap(28),locate_heatmap(29),color=color_heatmap(28))
fill(locate_heatmap(29),locate_heatmap(30),color=color_heatmap(29))
fill(locate_heatmap(30),locate_heatmap(31),color=color_heatmap(30))
fill(locate_heatmap(31),locate_heatmap(32),color=color_heatmap(31))
fill(locate_heatmap(32),locate_heatmap(33),color=color_heatmap(32))
fill(locate_heatmap(33),locate_heatmap(34),color=color_heatmap(33))
fill(locate_heatmap(34),locate_heatmap(35),color=color_heatmap(34))
fill(locate_heatmap(35),locate_heatmap(36),color=color_heatmap(35))
fill(locate_heatmap(36),locate_heatmap(37),color=color_heatmap(36))
fill(locate_heatmap(37),locate_heatmap(38),color=color_heatmap(37))
fill(locate_heatmap(38),locate_heatmap(39),color=color_heatmap(38))
fill(locate_heatmap(39),locate_heatmap(40),color=color_heatmap(39))
fill(locate_heatmap(40),locate_heatmap(41),color=color_heatmap(40))
fill(locate_heatmap(41),locate_heatmap(42),color=color_heatmap(41))
fill(locate_heatmap(42),locate_heatmap(43),color=color_heatmap(42))
fill(locate_heatmap(43),locate_heatmap(44),color=color_heatmap(43))
fill(locate_heatmap(44),locate_heatmap(45),color=color_heatmap(44))
fill(locate_heatmap(45),locate_heatmap(46),color=color_heatmap(45))
fill(locate_heatmap(46),locate_heatmap(47),color=color_heatmap(46))
fill(locate_heatmap(47),locate_heatmap(48),color=color_heatmap(47))
fill(locate_heatmap(48),locate_heatmap(49),color=color_heatmap(48))
fill(locate_heatmap(49),locate_heatmap(50),color=color_heatmap(49))
fill(locate_heatmap(50),locate_heatmap(51),color=color_heatmap(50))
fill(locate_heatmap(51),locate_heatmap(52),color=color_heatmap(51))
fill(locate_heatmap(52),locate_heatmap(53),color=color_heatmap(52))
fill(locate_heatmap(53),locate_heatmap(54),color=color_heatmap(53))
fill(locate_heatmap(54),locate_heatmap(55),color=color_heatmap(54))
fill(locate_heatmap(55),locate_heatmap(56),color=color_heatmap(55))
fill(locate_heatmap(56),locate_heatmap(57),color=color_heatmap(56))
fill(locate_heatmap(57),locate_heatmap(58),color=color_heatmap(57))
fill(locate_heatmap(58),locate_heatmap(59),color=color_heatmap(58))
fill(locate_heatmap(59),locate_heatmap(60),color=color_heatmap(59))
fill(locate_heatmap(60),locate_heatmap(61),color=color_heatmap(60))