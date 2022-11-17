//@version=1
study("OI Pressure Bands",overlay=true)
header('Data Source')
const dataSrc = input("Data Source(Scale)", 'hl2', options=['open','high','low','close','ohlc4','hlc3','hl2','high/low','hc2/lc2'])

seq src = hl2
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
header('Lookback Period')
const dataTimeframe = input("LookBack Period", 'Custom Period', options=['Chart','1m','3m','5m','15m','30m','1h','2h','4h','6h','8h','12h','D','2D','3D','4D','5D','6D','7D','14D','30D','50D','100D','Full','Custom Period'])
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
     tf = bar_index-1
     break
}

const custom = input("Custom Period",300)
seq length = tf==0?custom:tf
const latest = input("Display only the latest Lookback period",false)
seq bars = 8.64e7 * timeframe/1440 *(length+1), t = timenow() - time, cond = t<=bars

header('Color')
const minvalue = input('Intensity Min OI Change(%)',0),
  maxvalue = input('Intensity Max OI Change(%)',10,minval=0,maxval=20,tep=0.1)
const o = input('Open Positions Only',false)
seq type = o?oi_close>oi_close[1]?(oi_close-oi_close[1])/oi_close[1]*100:0:(oi_close-oi_close[1])/oi_close[1]*100,
  data = latest?cond?type:0:type
//
func acc_upper(x:var){
  var l = length+1
  var x_ = x/100
  var acc_u = 0, acc_ud = 0.0
     for(i=0;i<l;i++){
       acc_u = src<src[i]&src*(1+x_)>src[i]?data[i]:0
       acc_ud = acc_ud + acc_u 
     }
  seq acc_upper_ = acc_ud
  return acc_upper_
}
//
func acc_lower(x:var){
  var l = length+1
  var x_ = x/100
  var acc_l = 0, acc_ld = 0.0
     for(i=0;i<l;i++){
       acc_l = src>src[i]&src*(1-x_)<src[i]?data[i]:0
       acc_ld = acc_ld + acc_l
     }
  seq acc_lower_ = acc_ld
  return acc_lower_
}
//
header('','')
const dataGradient = input("Theme", 'Thermovision🔥', options=['Tradinglite','Next🚔','Thermovision🔥'])
seq grad = 2
switch(dataGradient){
  case 'Tradinglite':
     grad = 1
     break
  case 'Next🚔':
     grad = 2
     break
  case  'Thermovision🔥':
     grad = 3
     break
}
const transp_ = input('Transparency(%)',0,minval=0,maxval=100,step=1), transp = transp_/100

func color(sequence:seq){
  seq unit = (maxvalue-minvalue)/17
  seq color = 
    sequence >=maxvalue                                   ?grad==1?blend(#FFFF00FF,#FFFF0000,transp):grad==2?blend(#A50F15FF,#A50F1500,transp):blend(#FFFDE2FF,#FFFDE200,transp):
    sequence <maxvalue        &sequence>=maxvalue-unit    ?grad==1?blend(#E3EE1BFF,#E3EE1B00,transp):grad==2?blend(#BD301FFF,#BD301F00,transp):blend(#FFF177FF,#FFF17700,transp):
    sequence <maxvalue-unit   &sequence >=maxvalue-unit*2 ?grad==1?blend(#C9DE20FF,#C9DE2000,transp):grad==2?blend(#D4522AFF,#D4522A00,transp):blend(#FFDE1BFF,#FFDE1B00,transp):
    sequence <maxvalue-unit*2 &sequence >=maxvalue-unit*3 ?grad==1?blend(#C9DE20FF,#C9DE2000,transp):grad==2?blend(#EC7434FF,#EC743400,transp):blend(#FEC600FF,#FEC60000,transp):
    sequence <maxvalue-unit*3 &sequence >=maxvalue-unit*4 ?grad==1?blend(#8BD050FF,#8BD05000,transp):grad==2?blend(#FE9545FF,#FE954500,transp):blend(#FDA800FF,#FDA80000,transp):
    sequence <maxvalue-unit*4 &sequence >=maxvalue-unit*5 ?grad==1?blend(#73D055FF,#73D05500,transp):grad==2?blend(#FEB468FF,#FEB46800,transp):blend(#F88900FF,#F8890000,transp):
    sequence <maxvalue-unit*5 &sequence >=maxvalue-unit*6 ?grad==1?blend(#3CBB75FF,#3CBB7500,transp):grad==2?blend(#FFD28BFF,#FFD28800,transp):blend(#F26C01FF,#F26C0100,transp):
    sequence <maxvalue-unit*6 &sequence >=maxvalue-unit*7 ?grad==1?blend(#39A764FF,#39A76400,transp):grad==2?blend(#FFF0AEFF,#FFF0AE00,transp):blend(#EB520AFF,#EB520A00,transp):
    sequence <maxvalue-unit*7 &sequence >=maxvalue-unit*8 ?grad==1?blend(#209B7FFF,#209B7F00,transp):grad==2?blend(#FFF0AEFF,#FFF0AE00,transp):blend(#EB520AFF,#EB520A00,transp):
    sequence <maxvalue-unit*8 &sequence >=maxvalue-unit*9 ?grad==1?blend(#1D8C73FF,#1D8C7300,transp):grad==2?blend(#E6F6C0FF,#E6F6C000,transp):blend(#DF363DFF,#DF363D00,transp):
    sequence <maxvalue-unit*9 &sequence >=maxvalue-unit*10?grad==1?blend(#207174FF,#20717400,transp):grad==2?blend(#80CFC3FF,#80CFC300,transp):blend(#CF197BFF,#CF197B00,transp):
    sequence <maxvalue-unit*10&sequence >=maxvalue-unit*11?grad==1?blend(#2D6583FF,#2D658300,transp):grad==2?blend(#4DBBC4FF,#4DBBC400,transp):blend(#BC0593FF,#BC059300,transp):
    sequence <maxvalue-unit*11&sequence >=maxvalue-unit*12?grad==1?blend(#39568CFF,#39568C00,transp):grad==2?blend(#3B9CBBFF,#3B9CBB00,transp):blend(#9F009BFF,#9F009B00,transp):
    sequence <maxvalue-unit*12&sequence >=maxvalue-unit*13?grad==1?blend(#453781FF,#45378100,transp):grad==2?blend(#3479AEFF,#3479AE00,transp):blend(#71009DFF,#71009D00,transp):
    sequence <maxvalue-unit*13&sequence >=maxvalue-unit*14?grad==1?blend(#481567FF,#48156700,transp):grad==2?blend(#2C57A1FF,#2C57A100,transp):blend(#420095FF,#42009500,transp):
    sequence <maxvalue-unit*14&sequence >=maxvalue-unit*15?grad==1?blend(#351451FF,#35145100,transp):grad==2?blend(#253494FF,#25349400,transp):blend(#100078FF,#10007800,transp):
    sequence <maxvalue-unit*15&sequence >=maxvalue-unit*16?grad==1?blend(#30124BFF,#30124B00,transp):grad==2?blend(#030303FF,#03030300,transp):blend(#00002EFF,#00002E00,transp):
    blend(#0E0A1DFF,#0E0A1D00,transp)  
  return color
}
header('Band Interval')
const dataInterval = input("Band Interval", 'Equally', options=['Equally','Unequally'])
seq space = 1
switch(dataInterval){
  case 'Equally.':
     space = 1
     break
  case 'Unequally':
     space = 2
     break
}
header('','[Equally]')
const interval_per_band = input('per (%)',0.5,minval=0.1,maxval=2,step=0.1)
header('','[Unequally]')
const
  a_ = input('A (0-A)%',0.5,minval=0,maxval=20,step=0.1),
  b_ = input('B (A-B)%',1,minval=0,maxval=20,step=0.1),
  c_ = input('C (B-C)%',1.5,minval=0,maxval=20,step=0.1),
  d_ = input('D (C-D)%',2,minval=0,maxval=20,step=0.1),
  e_ = input('E (D-E)%',2.5,minval=0,maxval=20,step=0.1),
  f_ = input('F (E-F)%',3,minval=0,maxval=20,step=0.1),
  g_ = input('G (F-G)%',3.5,minval=0,maxval=20,step=0.1),
  h_ = input('H (G-H)%',4,minval=0,maxval=20,step=0.1),
  j_ = input('I (H-I)%',4.5,minval=0,maxval=20,step=0.1),
  k_ = input('J (I-J)%',5,minval=0,maxval=20,step=0.1)

seq 
  a = space==1?interval_per_band*1:a_,
  b = space==1?interval_per_band*2:b_,
  c = space==1?interval_per_band*3:c_,
  d = space==1?interval_per_band*4:d_,
  e = space==1?interval_per_band*5:e_,
  f = space==1?interval_per_band*6:f_,
  g = space==1?interval_per_band*7:g_,
  h = space==1?interval_per_band*8:h_,
  j = space==1?interval_per_band*9:j_,
  k = space==1?interval_per_band*10:k_
  
seq 
  upper_a = acc_upper(a),
  upper_b = acc_upper(b) - acc_upper(a),
  upper_c = acc_upper(c) - acc_upper(b),
  upper_d = acc_upper(d) - acc_upper(c),
  upper_e = acc_upper(e) - acc_upper(d),
  upper_f = acc_upper(f) - acc_upper(e),
  upper_g = acc_upper(g) - acc_upper(f),
  upper_h = acc_upper(h) - acc_upper(g),
  upper_j = acc_upper(j) - acc_upper(h),
  upper_k = acc_upper(k) - acc_upper(j)

seq 
  lower_a = acc_lower(a),
  lower_b = acc_lower(b) - acc_lower(a),
  lower_c = acc_lower(c) - acc_lower(b),
  lower_d = acc_lower(d) - acc_lower(c),
  lower_e = acc_lower(e) - acc_lower(d),
  lower_f = acc_lower(f) - acc_lower(e),
  lower_g = acc_lower(g) - acc_lower(f),
  lower_h = acc_lower(h) - acc_lower(g),
  lower_j = acc_lower(j) - acc_lower(h),
  lower_k = acc_lower(k) - acc_lower(j)

fill(latest?cond?src:na:src,src*(1+a/100), color=color(upper_a))
fill(latest?cond?src*(1+a/100):na:src*(1+a/100),src*(1+b/100), color=color(upper_b))
fill(latest?cond?src*(1+b/100):na:src*(1+b/100),src*(1+c/100), color=color(upper_c))
fill(latest?cond?src*(1+c/100):na:src*(1+c/100),src*(1+d/100), color=color(upper_d))
fill(latest?cond?src*(1+d/100):na:src*(1+d/100),src*(1+e/100), color=color(upper_e))
fill(latest?cond?src*(1+e/100):na:src*(1+e/100),src*(1+f/100), color=color(upper_f))
fill(latest?cond?src*(1+f/100):na:src*(1+f/100),src*(1+g/100), color=color(upper_g))
fill(latest?cond?src*(1+g/100):na:src*(1+g/100),src*(1+h/100), color=color(upper_h))
fill(latest?cond?src*(1+h/100):na:src*(1+h/100),src*(1+j/100), color=color(upper_j))
fill(latest?cond?src*(1+j/100):na:src*(1+j/100),src*(1+k/100), color=color(upper_k))

fill(latest?cond?src:na:src,src*(1-a/100), color=color(lower_a))
fill(latest?cond?src*(1-a/100):na:src*(1-a/100),src*(1-b/100), color=color(lower_b))
fill(latest?cond?src*(1-b/100):na:src*(1-b/100),src*(1-c/100), color=color(lower_c))
fill(latest?cond?src*(1-c/100):na:src*(1-c/100),src*(1-d/100), color=color(lower_d))
fill(latest?cond?src*(1-d/100):na:src*(1-d/100),src*(1-e/100), color=color(lower_e))
fill(latest?cond?src*(1-e/100):na:src*(1-e/100),src*(1-f/100), color=color(lower_f))
fill(latest?cond?src*(1-f/100):na:src*(1-f/100),src*(1-g/100), color=color(lower_g))
fill(latest?cond?src*(1-g/100):na:src*(1-g/100),src*(1-h/100), color=color(lower_h))
fill(latest?cond?src*(1-h/100):na:src*(1-h/100),src*(1-j/100), color=color(lower_j))
fill(latest?cond?src*(1-j/100):na:src*(1-j/100),src*(1-k/100), color=color(lower_k))