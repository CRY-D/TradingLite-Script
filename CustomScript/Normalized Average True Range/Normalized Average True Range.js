//@version=1 // by SMG
study("nATR",  overlay=false)

const length = input("Length",30)

const dataMA = input("Smoothing", 'RMA', options=['SMA','EMA','RMA','WMA','HMA','EHMA','THMA'])
seq srcMA = 1
switch(dataMA){
  case 'SMA':
     srcMA = 1
     break
  case 'EMA':
     srcMA = 2
     break
  case 'RMA':
     srcMA = 3
     break
  case 'WMA':
     srcMA = 4
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
func f_atr(_tr_len:var) {
    seq _tr = max((high-close),abs(high-close[1]),abs(low-close[1]))
    seq _atr = 
      srcMA==1?sma(_tr,_tr_len):
      srcMA==2?ema(_tr,_tr_len):
      srcMA==3?rma(_tr,_tr_len):
      srcMA==4?wma(_tr,_tr_len):rma(_tr,_tr_len)
    return _atr
  }
seq natr = f_atr(length)/close*100
//
const i_std = input("Std Dev", 2)
seq natr_upper = natr + stdev(natr, length)*i_std
seq natr_lower = natr - stdev(natr, length)*i_std
//
const color = input('Color',#2196f3)
//
plot(natr,  color=color)
plot(natr_upper,color=color,transp=40)
plot(natr_lower,color=color,transp=40)
fill(natr_upper,natr_lower,color=color,transp=80)