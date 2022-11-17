//@version=1
study("Taker Buy Sell Volume Ratio")
header("Config")
const dataMode = input("mode", 'Line', options=['Line','Candle'])
seq mode = 1
switch(dataMode){
  case 'Line':
     mode=1
     break
  case 'Candle':
     mode=2
     break
}
//
const dataType = input("type", 'Taker Buy Sell Ratio', options=['Taker Buy Ratio','Taker Sell Ratio','Taker Buy Sell Ratio'])
seq type = 3
switch(dataType){
  case 'Taker Buy Ratio':
     type=1
     break
  case 'Taker Sell Ratio':
     type=2
     break
  case 'Taker Buy Sell Ratio':
     type=3
     break
}
//
const dataMAtype = input("MA type", 'SMA', options=['SMA','EMA','RMA','WMA','HMA','EHMA','THMA'])
seq MAtype = 1
switch(dataMAtype){
  case 'SMA':
     MAtype = 1
     break
  case 'EMA':
     MAtype = 2
     break
  case 'RMA':
     MAtype = 3
     break
  case 'WMA':
     MAtype = 4
     break
  case 'HMA':
     MAtype = 5
     break
  case 'EHMA':
     MAtype = 6
     break
  case 'THMA':
     MAtype = 7
     break
}
//
func wma(source:seq,len:var){
  var l = len - 1
  var l2 = len
  var wtsum = 0
  var wtdsum = 0.0
     for(i=0;i<l;i++){
       wtdsum = wtdsum + source[i] * l2 
       wtsum = wtsum + l2 
       l2 = l2 - 1
     }
  seq wma_ = wtdsum / wtsum
  return wma_
}
//
func hma(source:seq,len:var){
  var a1 = wma(source,len)
  var len2 = round(len/2)
  var a2 = wma(source,len2)
  var len3 = round(sqrt(len))
  seq a3 = 2 * a2 -a1
  seq hma_ = wma(a3,len3)
  return hma_
}
//
func ehma(source:seq,len:var){
  var ea1 = ema(source,len)
  var elen2 = round(len/2)
  var ea2 = ema(source,elen2)
  var elen3 = round(sqrt(len))
  seq ea3 = 2 * ea2 - ea1
  seq ehma_ = ema(ea3,elen3)
  return ehma_
}
//
func thma(source:seq,len:var){
  var tlen2 = round(len/2)
  var tlen3 = round(len/3)
  var ta1 = wma(source,len)
  var ta2 = wma(source,tlen2)
  var ta3 = wma(source,tlen3)
  seq ta4 = ta3 * 3 - ta2 -ta1
  seq thma_ = wma(ta4,len)
  return thma_
}
//
header("",'MA length')
const dataTimeframe = input("Timeframe", 'Custom Period', options=['Chart','1m','3m','5m','15m','30m','1h','2h','4h','6h','8h','12h','D','2D','3D','4D','5D','6D','7D','14D','30D','50D','100D','Full','Custom Period'])

seq tf = 1
switch(dataTimeframe){
  case 'Custom Period':
     tf = 0
     break
  case 'Chart':
     tf = 1
     break
  case '1m':
     tf = 1/timeframe
     break
  case '3m':
     tf = 3/timeframe
     break
  case '5m':
     tf = 5/timeframe
     break
  case '15m':
     tf = 15/timeframe
     break
  case '30m':
     tf = 30/timeframe
     break
  case '1h':
     tf = 60/timeframe
     break
  case '2h':
     tf = 120/timeframe
     break
  case '4h':
     tf = 240/timeframe
     break
  case '6h':
     tf = 360/timeframe
     break
  case '8h':
     tf = 480/timeframe
     break
  case '12h':
     tf = 720/timeframe
     break
  case 'D':
     tf = 1440/timeframe
     break
  case '2D':
     tf = 2*1440/timeframe
     break
  case '3D':
     tf = 3*1440/timeframe
     break
  case '4D':
     tf = 4*1440/timeframe
     break
  case '5D':
     tf = 5*1440/timeframe
     break
  case '6D':
     tf = 6*1440/timeframe
     break
  case '7D':
     tf = 7*1440/timeframe
     break
  case '14D':
     tf = 14*1440/timeframe
     break
  case '30D':
     tf = 30*1440/timeframe
     break
  case '50D':
     tf = 50*1440/timeframe
     break
  case '100D':
     tf = 30*1440/timeframe
     break
  case 'Full':
     tf = bar_index
     break
}
const custom = input("Custom Period",100)
seq len = tf==0?custom:tf

header("Color")
const color_base = input("Color",color.gray)
const colorchange = input("", 'Auto', options=['Auto','Custom'])
seq cc = 1
switch(colorchange){
  case 'Auto':
     cc=1
     break
  case 'Custom':
     cc=2
     break
}

header("")
const 
  level_above=input("Above.[Custom]",1.1),
  color_above=input("", #2196F3FF),
  level_below=input("Below.[Custom]",0.9),
  color_below=input("", #FF0000FF)

seq level_auto = type==1?0.5:type==2?0.5:type==3?1.0:na
//
seq v = vbuy+vsell
seq r = type==1?vbuy/v:type==2?vsell/v:type==3?vbuy:na

seq ratio = 
  type==1&MAtype==1?sma(r,len):type==1&MAtype==2?ema(r,len):type==1&MAtype==3?rma(r,len):type==1&MAtype==4?wma(r,len):type==1&MAtype==5?hma(r,len):type==1&MAtype==6?ehma(r,len):type==1&MAtype==7?thma(r,len):
  type==2&MAtype==1?sma(r,len):type==2&MAtype==2?ema(r,len):type==2&MAtype==3?rma(r,len):type==2&MAtype==4?wma(r,len):type==2&MAtype==5?hma(r,len):type==2&MAtype==6?ehma(r,len):type==2&MAtype==7?thma(r,len):
  type==3&MAtype==1?sma(r,len)/sma(vsell,len):type==3&MAtype==2?ema(r,len)/ema(vsell,len):type==3&MAtype==3?rma(r,len)/rma(vsell,len):type==3&MAtype==4?wma(r,len)/wma(vsell,len):type==3&MAtype==5?hma(r,len)/hma(vsell,len):type==3&MAtype==6?ehma(r,len)/ehma(vsell,len):type==3&MAtype==7?thma(r,len)/thma(vsell,len):na


seq color = color_base
if(cc==1&ratio>level_auto){color=color_above}
else if(cc==1&ratio<level_auto){color=color_below}
else if(cc==2&ratio>level_above){color=color_above}
else if(cc==2&ratio<level_below){color=color_below}

plot(mode==1?bar_index>=len?ratio:na:na, linewidth=2, color=color)
plotcandle(mode==2?bar_index>=len?ratio[1]:na:na,
           mode==2?bar_index>=len?ratio:na:na,
           mode==2?bar_index>=len?ratio:na:na,
           mode==2?bar_index>=len?ratio:na:na)