//@version=1 // by SMG
study("Trend",overlay=true)//Inspired by Silico's Trend Heuristics 
header('Configs','Candle')
const dataCANDLE = input("Candle type", 'Candle', options=['None','Candle','Candle like','HL Candle'])
seq p = 1
switch(dataCANDLE){
  case 'None':
     p = 0
     break
  case 'Candle':
     p = 1
     break
  case 'Candle like':
     p = 2
     break
  case 'HL Candle':
     p = 3
     break
}

header('','MA Channel')
const dataTimeframe = input("Timeframe", 'Chart', options=['Chart','1m','3m','5m','15m','30m','1h','2h','4h','6h','8h','12h','D'])
seq tf = 0
switch(dataTimeframe){
  case 'Chart':
     tf = 0
     break
  case '1m':
     tf = 1/1440
     break
  case '3m':
     tf = 1/480
     break
  case '5m':
     tf = 1/288
     break
  case '15m':
     tf = 1/96
     break
  case '30m':
     tf = 1/48
     break
  case '1h':
     tf = 1/24
     break
  case '2h':
     tf = 1/12
     break
  case '4h':
     tf = 1/6
     break
  case '6h':
     tf = 1/4
     break
  case '8h':
     tf = 1/3
     break
  case '12h':
     tf = 1/2
     break
  case 'D':
     tf = 1
     break
}
seq ss = floor((time/1000-1576022400)/86400/tf)
var prevss = ss[1]
seq newss = ss!=prevss
seq o = 0, h = 0, l = 0, c = 0
o = tf==0?open : newss ? open[tf*1440/timeframe+1] : o[1]
h = tf==0?high : newss ? highest(high, tf*1440/timeframe) : h[1]
l = tf==0?low : newss ?  lowest(low, tf*1440/timeframe) : l[1]
c =  tf==0?close : newss ? close : c[1]
//
const dataSrc = input("Data Source", 'close', options=['open','high','low','close','ohlc4','hlc3','hl2','high/low','hc2/lc2'])

seq src = c
switch(dataSrc){
  case 'open':
     src = o
     break
  case 'high':
     src = h
     break
  case 'low':
     src = l
     break
  case 'close':
     src = c
     break
  case 'ohlc4':
     src = (o+h+l+c)/4
     break
  case 'hlc3':
     src = (h+l+c)/3
     break
  case 'hl2':
     src = (h+l)/2
     break
  case 'high/low':
     src = c>c[1]?h:l
     break
  case 'hc2/lc2':
     src = c>c[1]?(h+c)/2:(l+c)/2
     break
}
//

const dataMA = input("MA type", 'WMA', options=['SMA','EMA','RMA','WMA','HMA','EHMA','THMA'])
seq ma = 4
switch(dataMA){
  case 'SMA':
     ma = 1
     break
  case 'EMA':
     ma = 2
     break
  case 'RMA':
     ma = 3
     break
  case 'WMA':
     ma = 4
     break
  case 'HMA':
     ma = 5
     break
  case 'EHMA':
     ma = 6
     break
  case 'THMA':
     ma = 7
     break
}
//
func wma(source:seq,len:var){
  var l1 = len - 1
  var l2 = len
  var wtsum = 0
  var wtdsum = 0.0
     for(i=0;i<l1;i++){
       wtdsum = wtdsum + source[i] * l2 
       wtsum = wtsum + l2 
       l2 = l2 - 1
     }
  seq wma_ = wtdsum / wtsum
  return wma_
}

func hma(source:seq,len:var){
  var a1 = wma(source,len)
  var len2 = round(len/2)
  var a2 = wma(source,len2)
  var len3 = round(sqrt(len))
  seq a3 = 2 * a2 -a1
  seq hma_ = wma(a3,len3)
  return hma_
}

func ehma(source:seq,len:var){
  var ea1 = ema(source,len)
  var elen2 = round(len/2)
  var ea2 = ema(source,elen2)
  var elen3 = round(sqrt(len))
  seq ea3 = 2 * ea2 - ea1
  seq ehma_ = ema(ea3,elen3)
  return ehma_
}

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



const length_ = input("MA length(180-200 for floating S/R , 55 for swing entry)",55)
seq length = tf==0?length_:length_*tf*1440/timeframe
const multiplier = input('Channel Width Multiplier',1,minval=0,maxval=10,step=0.01)

func atr(_atr_len:var) {
    seq _tr = max((h-c),abs(h-c[1]),abs(l-c[1]))
    seq _atr = sma(_tr, _atr_len)
    return _atr
  }
//

seq lead_line = ma==1?sma(src,length):
  ma==2?ema(src,length):
  ma==3?rma(src,length):
  ma==4?wma(src,length):
  ma==5?hma(src,length):
  ma==6?ehma(src,length):
  ma==7?thma(src,length):
  hma(src,length)
seq upper_line = lead_line+atr(length)*multiplier
seq lower_line = lead_line-atr(length)*multiplier

header('','Color')
const bull = input('Bull',color.lime)
seq bull_ = lead_line < src & upper_line < src
const bear = input('Bear',color.red)
seq bear_ = lead_line > src  & lower_line > src
const neutral = input('Neutral',#9E9E9EFF)
seq n = bull_==false&bear_==false
const diver = input('Divergence',false)
seq v = vbuy+vsell
seq bigv = v>sma(v,20)
seq bull_diver = close<open&vbuy>vsell&bigv , bear_diver = close>open&vbuy<vsell&bigv
seq  color = bull_ ? diver&bull_diver ? color.yellow  : bull :
   bear_ ? diver&bear_diver ? #2196F3FF : bear : neutral
plot(lead_line, color=color.white,linewidth=2,showprice=false)
fill(upper_line,lower_line, color=color.gray,transp=50,showprice=false)

plotcandle(p==1?open:na,p==1?high:na,p==1?low:na,p==1?close:na, color=color,showprice=false)
histogram(p==2?close-open:na, open, color=color,showprice=false)
histogram(p==2?high-low:na, low ,color=color,transp=40,showprice=false)
histogram(p==3?high-low:na, p==3?low:na ,color=color,transp=0,showprice=false)
