//@version=1 //by SMG
study("Delta Dominance HL", overlay=true)
const dataCANDLE = input("Candle type", 'Candle like', options=['None','Candle','Candle like','HL Candle'])
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
const show_price = input("Show Plice line",false)

//
seq vol = vbuy + vsell
seq ir = vbuy>vsell?vbuy/vol*100:vsell/vol*100
header("Color")
const vir =input("Volume Imbalance Ratio(%)", 60, maxval=100,minval=50,step=0.1)
header("")
const 
  color_buy = input("Buy", color.lime),
  color_sell = input("Sell", color.magenta),
  color_neutral = input("Neutral", #808080CC)

var color = color_neutral
if (ir>vir) {
  if (vbuy>vsell) {
      color = color_buy
    } 
  else color = color_sell}
else { color = color_neutral }

//
plotcandle(p==1?open:na,p==1?high:na,p==1?low:na,p==1?close:na, color=color,showprice=false)
histogram(p==2?close-open:na, open, color=color,showprice=false)
histogram(p==2?high-low:na, low ,color=color,transp=40,showprice=false)
histogram(p==3?high-low:na, p==3?low:na ,color=color,transp=0,showprice=false)

plot(show_price?close:na, color=color) 