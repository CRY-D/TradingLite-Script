//@version=1 // by SMG
study("Funding")
const yield = input('Convert to Yield',false)
header('')
const dataFR = input("Excahnge", 'Binance Futures', options=['Binance Futures','FTX','Bybit'])
seq per_day = 3
switch(dataFR){
  case 'Binance Futures':
     per_day = 3
     break
  case 'FTX':
     per_day = 24
     break
  case 'Bybit':
     per_day = 3
     break
}
header('Plot')
const 
  show_zero = input('Show 0-line',true)
header('')
const
  show_fr = input('Show Funding',true),
  show_fr_pre = input('Show Predicted Funding',true)
header('')
const  
  show_fr_com = input('Show Compounded Funding',false),
  length_com = input('Compounded Days', 1,minval=1,maxval=30,step=1)

seq fr_pre = per_day == 3 ? funding : per_day == 24 ? funding_predicted : 0

seq s = floor((time/1000-1576022400)/86400*per_day)
var prevs = s[1], news = s!=prevs
seq fr = 0, fr_ = 0
fr =  news ? funding : fr[1],
fr_ = news ? funding : 0
//
seq adj = 1440/timeframe, length = adj*length_com
var fr_d = 0, fr__d = 0.0
for(i=0;i<length;i++){
    fr_d = fr_d + fr_[i], fr__d = fr_d
}
seq fr_com = fr__d

//
header('Color')
const 
  pos = input('Positive',#FFFFFFFF),
  neg = input('Negative',#00C98EFF),
  color = fr>=0?pos:neg,
  color_pre = fr_pre>=0?pos:neg,
  color_com = fr_com>=0?pos:neg
//
plot(show_zero?0:na)
//
seq 
  plot_fr = yield ? fr*per_day*365 : fr,
  plot_fr_pre = yield ? fr_pre*per_day*365 : fr_pre,
  plot_fr_com = yield ? fr_com*per_day*365 : fr_com

histogram(show_fr?plot_fr:na,0, color=color, transp=40)
plot(show_fr_pre?plot_fr_pre:na,linewidth=3,color=color_pre)
plot(bar_index>length&show_fr_com?plot_fr_com:na,linewidth=3,color=color_com)
