//@version=1 //by SMG
study("Volume Bubbles", overlay=true)
header("Configs:")
header("Source")
const dataSrc = input("Data Source", 'close', options=['open','high','low','close','ohlc4','hlc3','hl2','high/low','hc2/lc2'])

seq src = close
switch(dataSrc){
  case 'open':
     src = open
     break
  case 'high':
     src = high
     break
  case 'low':
     src = low
     break
  case 'close':
     src = close
     break
  case 'ohlc4':
     src = ohlc4
     break
  case 'hlc3':
     src = hlc3
     break
  case 'hl2':
     src = hl2
     break
  case 'high/low':
     src = close>close[1]?high:low
     break
  case 'hc2/lc2':
     src = close>close[1]?(high+close)/2:(low+close)/2
     break
}

header("Size")
const auto = input("Auto Max Volume", true)
const maxvol = input("Custom Max Volume",3000)
const minvol = input("Custom Min Volume", 0)

const multiplier = input("Multiplier", 100)
//
seq v = vbuy + vsell
seq amax = highest(v,bar_index)
seq maxv = auto?amax:maxvol

seq oid = (oi_close-oi_close[1])/oi_close[1]*100
header("","Open Positions")
const 
  op = input("open positions only", false),
  thoi = input("Threshold Open Interest move(%)",0,minval=0,maxval=10,step=0.01),
  hop = input("highlight open positions above level", false),
  hcolor_o = input("",#FFFFFFff)

//only new positions
seq v_n = oid>0 ? src : na
//
seq v_o = oid>thoi ? src : na

header("","Close Positions")
const 
  thoim = input("Threshold Open Interest move(-%)",0,minval=0,maxval=10,step=0.01),
  hcp = input("highlight close positions under level", false),
  hcolor_c = input("",color.gray)
//
seq v_c = oid<-thoim ? src : na

header("Color")
const vir =input("Volume Imbalance Ratio(%)", 50, maxval=100,minval=50,step=0.1)
header("")
const 
  b = input("Buy", #2196F3CC),
  s = input("Sell", #F44336CC),
  n = input("Neutral", #808080CC)

seq vol = vbuy + vsell
seq ir = vbuy>vsell?vbuy/vol*100:vsell/vol*100
header("")
const color_oi_based = input("Color Based on Open Interest",false)
const 
  ob = input("Buy(Open)",#21DCF3CC),
  cb = input("Buy(Close)",#004D8ACC),
  os = input("Sell(Open)",#F57066CC),
  cs = input("Sell(Close)",#BD0D00CC),
  on = input("Neutral(Open)",#808080CC),
  cn = input("Neutral(Close)",#262626CC)

var color = color.white
if (ir>vir) {
  if (vbuy>vsell) {
    if (color_oi_based) {
      color = oid>0?ob:cb
    } else color = b
  }
  else if (vsell>vbuy) {
    if (color_oi_based) {
      color = oid>0?os:cs
    } else color = s
  }
} else {
  if (color_oi_based) {
      color = oid>0?on:cn
    } else color = n
}
//plot
plotshape(op  ? v_n : src, shape.circle , v/maxv*multiplier, color=color)  
plotshape(hop ? v_o : na, shape.circle_thin , v/maxv*multiplier, color=hcolor_o)  
plotshape(hcp ? v_c : na, shape.circle_thin , v/maxv*multiplier, color=hcolor_c)  