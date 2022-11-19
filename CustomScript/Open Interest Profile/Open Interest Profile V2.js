//@version=1 //by SMG
study("OIP/FR",overlay=true)
header('Open Interest Profile Variation')
const dataOIP = input("OI Profile Variation", 'Delta', options=['Open Positions Only','Close Positions Only','Delta'])
seq oip_var = 3
switch(dataOIP){
  case 'Open Positions Only':
     oip_var = 1
     break
  case 'Close Positions Only':
     oip_var = 2
     break
  case 'Delta':
     oip_var = 3
     break
}
//
header('Data Source','')
const dataSrc = input("Data Source(Scale)", 'hl2', options=['open','high','low','close','ohlc4','hlc3','hl2','high/low','hc2/lc2'])
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
//
const dataOISrc = input("Data Source(Profile)", 'oi_close', options=['oi_open','oi_high','oi_low','oi_close','oi_ohlc4','oi_hlc3','oi_hl2'])
seq oi_src = oi_close
switch(dataOISrc){
  case 'oi_open':
     oi_src = oi_open
     break
  case 'oi_high':
     oi_src = oi_high
     break
  case 'oi_low':
     oi_src = oi_low
     break
  case 'oi_close':
     oi_src = oi_close
     break
  case 'oi_ohlc4':
     oi_src = oi_ohlc4
     break
  case 'oi_hlc3':
     oi_src = oi_hlc3
     break
  case 'oi_hl2':
     oi_src = oi_hl2
     break
}
header('OI Big-move Filter')
const filter = input('Big-move Filter',false),
  spike = input('Big-move(%)', 1, minval=0.1, maxval=5, step=0.1)

header('Lookback Period','')
const dataStart = input("Lookback Period", 'LookBack Period in Bars', options=['Lookback Period in Bars','Lookback Period in Days','Date'])
seq start = 0
switch(dataStart){
  case 'Lookback Period in Bars':
    start = 0
     break
  case 'Lookback Period in Days':
    start = 1
     break
  case 'Date':
     start = 2
     break
}
header('')
var lb = input('Bars [Lookback Period in Bars]',300,minval=1,maxval=1000,step=1),lb_ = input('Days [Lookback Period in Days]',1),
  t_adj = 8.64e7*timeframe/1440,
  bars = t_adj*(lb+1), bars_= t_adj*(lb), 
  days = 8.64e7 * lb_,
  t = timenow() - time,
  year= input("Year [Date]",2022),
  month= input("Month [Date]",9,minval=1,maxval=12,step=1),
  day = input("Day [Date]",13,minval=1,maxval=31,step=1),
  hour = input("Hour [Date]",12,minval=0,maxval=23,step=1),
  minute = input("Minute [Date]",30,minval=0,maxval=59,step=1),
  ts = timestamp(year,month,day,hour,minute,0),
  cond = start==0?t<=bars: start==1 ? t < days : start==2? time>=ts:na,
  show_start = input("Show Start Location",false),
  locate_cond = start==0?t<=bars&t>=bars_:
     start==1?t>(8.64e7*(lb_-timeframe/1440))&t<days:
     start==2?time[1]<ts&time>=ts:na

bgcolor(show_start&locate_cond ? #FFFFFF50:na)

//
seq oid = cond?oi_src-oi_src[1]:0, oispike = abs((oi_src-oi_src[1])/oi_src[1])*100,
  data_=oip_var==1?oid>0?oid:0:oip_var==2?oid<0?oid:0:oip_var==3?oid:0, data=filter?oispike>=spike?data_:0:data_
//
seq length = start==0?lb:
  start==1?lb_*1440/timeframe:
  start==2?((time-ts)/t_adj):0
//
seq h =highest(high,length),
  l = lowest(low,length)
//
header('Row size','')
const row = input('Number of Rows', 25,minval=1, maxval=25,step=1)
const l_width = input('Linewidth',3,minval=1,maxval=10,step=1), lwidth = l_width*10

seq width = (h-l)/row
func cal_profile(n:var){
  var acc_ = 0, acc_d = 0.0
     for(i=0;i<length;i++){
         acc_ = l+(width*(n-1))<=src[i] & l+(width*(n))>src[i] ? data[i]: 0
         acc_d = acc_d + acc_ 
     }
  seq cal_profile_ = acc_d
  return cal_profile_
}
//
var poc_ = 0, poc = 0
  for(i=1;i<row;i++){
    poc_ = max(abs(cal_profile(i)),abs(cal_profile(i+1))) 
    poc = max(poc,poc_)
    }

func size(n:var){
  seq oip = cal_profile(n), 
    size_=abs(oip)/poc
  return size_
}
//
const ver_shift = input('Vertical Shift',0.5,minval=0,maxval=1,step=0.01)
//location
func locate(n:var){
  var locate_ = 0
  if (n<=row){
    locate_ = barstate.islast?l+(width*(n-1))+width*ver_shift:na
  }
  return locate_
}
header('Color')
//color
const col_pos = input('OI Increased',color.yellow), col_neg =input('OI Decreased', color.magenta)
//header('')
func color(n:var){
  var color_ = #FFFFFF00
  if (cal_profile(n)>0){color_ = col_pos} 
  else {color_ = col_neg}
  return color_
}

//plot
plotshape(size(1)==1.00?locate(1):na,shape.minus,lwidth,offset=4,color=color(1))
plotshape(size(1)>=0.90?locate(1):na,shape.minus,lwidth,offset=6,color=color(1))
plotshape(size(1)>=0.80?locate(1):na,shape.minus,lwidth,offset=8,color=color(1))
plotshape(size(1)>=0.70?locate(1):na,shape.minus,lwidth,offset=10,color=color(1))
plotshape(size(1)>=0.60?locate(1):na,shape.minus,lwidth,offset=12,color=color(1))
plotshape(size(1)>=0.50?locate(1):na,shape.minus,lwidth,offset=14,color=color(1))
plotshape(size(1)>=0.40?locate(1):na,shape.minus,lwidth,offset=16,color=color(1))
plotshape(size(1)>=0.30?locate(1):na,shape.minus,lwidth,offset=18,color=color(1))
plotshape(size(1)>=0.20?locate(1):na,shape.minus,lwidth,offset=20,color=color(1))
plotshape(size(1)>=0.10?locate(1):na,shape.minus,lwidth,offset=22,color=color(1))
plotshape(size(1)>=0.01?locate(1):na,shape.minus,lwidth,offset=24,color=color(1))

plotshape(size(2)==1.00?locate(2):na,shape.minus,lwidth,offset=4,color=color(2))
plotshape(size(2)>=0.90?locate(2):na,shape.minus,lwidth,offset=6,color=color(2))
plotshape(size(2)>=0.80?locate(2):na,shape.minus,lwidth,offset=8,color=color(2))
plotshape(size(2)>=0.70?locate(2):na,shape.minus,lwidth,offset=10,color=color(2))
plotshape(size(2)>=0.60?locate(2):na,shape.minus,lwidth,offset=12,color=color(2))
plotshape(size(2)>=0.50?locate(2):na,shape.minus,lwidth,offset=14,color=color(2))
plotshape(size(2)>=0.40?locate(2):na,shape.minus,lwidth,offset=16,color=color(2))
plotshape(size(2)>=0.30?locate(2):na,shape.minus,lwidth,offset=18,color=color(2))
plotshape(size(2)>=0.20?locate(2):na,shape.minus,lwidth,offset=20,color=color(2))
plotshape(size(2)>=0.10?locate(2):na,shape.minus,lwidth,offset=22,color=color(2))
plotshape(size(2)>=0.01?locate(2):na,shape.minus,lwidth,offset=24,color=color(2))

plotshape(size(3)>=0.01?locate(3):na,shape.minus,lwidth,offset=24,color=color(3))
plotshape(size(3)==1.00?locate(3):na,shape.minus,lwidth,offset=4,color=color(3))
plotshape(size(3)>=0.90?locate(3):na,shape.minus,lwidth,offset=6,color=color(3))
plotshape(size(3)>=0.80?locate(3):na,shape.minus,lwidth,offset=8,color=color(3))
plotshape(size(3)>=0.70?locate(3):na,shape.minus,lwidth,offset=10,color=color(3))
plotshape(size(3)>=0.60?locate(3):na,shape.minus,lwidth,offset=12,color=color(3))
plotshape(size(3)>=0.50?locate(3):na,shape.minus,lwidth,offset=14,color=color(3))
plotshape(size(3)>=0.40?locate(3):na,shape.minus,lwidth,offset=16,color=color(3))
plotshape(size(3)>=0.30?locate(3):na,shape.minus,lwidth,offset=18,color=color(3))
plotshape(size(3)>=0.20?locate(3):na,shape.minus,lwidth,offset=20,color=color(3))
plotshape(size(3)>=0.10?locate(3):na,shape.minus,lwidth,offset=22,color=color(3))
plotshape(size(3)>=0.01?locate(3):na,shape.minus,lwidth,offset=24,color=color(3))

plotshape(size(4)==1.00?locate(4):na,shape.minus,lwidth,offset=4,color=color(4))
plotshape(size(4)>=0.90?locate(4):na,shape.minus,lwidth,offset=6,color=color(4))
plotshape(size(4)>=0.80?locate(4):na,shape.minus,lwidth,offset=8,color=color(4))
plotshape(size(4)>=0.70?locate(4):na,shape.minus,lwidth,offset=10,color=color(4))
plotshape(size(4)>=0.60?locate(4):na,shape.minus,lwidth,offset=12,color=color(4))
plotshape(size(4)>=0.50?locate(4):na,shape.minus,lwidth,offset=14,color=color(4))
plotshape(size(4)>=0.40?locate(4):na,shape.minus,lwidth,offset=16,color=color(4))
plotshape(size(4)>=0.30?locate(4):na,shape.minus,lwidth,offset=18,color=color(4))
plotshape(size(4)>=0.20?locate(4):na,shape.minus,lwidth,offset=20,color=color(4))
plotshape(size(4)>=0.10?locate(4):na,shape.minus,lwidth,offset=22,color=color(4))
plotshape(size(4)>=0.01?locate(4):na,shape.minus,lwidth,offset=24,color=color(4))

plotshape(size(5)==1.00?locate(5):na,shape.minus,lwidth,offset=4,color=color(5))
plotshape(size(5)>=0.90?locate(5):na,shape.minus,lwidth,offset=6,color=color(5))
plotshape(size(5)>=0.80?locate(5):na,shape.minus,lwidth,offset=8,color=color(5))
plotshape(size(5)>=0.70?locate(5):na,shape.minus,lwidth,offset=10,color=color(5))
plotshape(size(5)>=0.60?locate(5):na,shape.minus,lwidth,offset=12,color=color(5))
plotshape(size(5)>=0.50?locate(5):na,shape.minus,lwidth,offset=14,color=color(5))
plotshape(size(5)>=0.40?locate(5):na,shape.minus,lwidth,offset=16,color=color(5))
plotshape(size(5)>=0.30?locate(5):na,shape.minus,lwidth,offset=18,color=color(5))
plotshape(size(5)>=0.20?locate(5):na,shape.minus,lwidth,offset=20,color=color(5))
plotshape(size(5)>=0.10?locate(5):na,shape.minus,lwidth,offset=22,color=color(5))
plotshape(size(5)>=0.01?locate(5):na,shape.minus,lwidth,offset=24,color=color(5))

plotshape(size(6)==1.00?locate(6):na,shape.minus,lwidth,offset=4,color=color(6))
plotshape(size(6)>=0.90?locate(6):na,shape.minus,lwidth,offset=6,color=color(6))
plotshape(size(6)>=0.80?locate(6):na,shape.minus,lwidth,offset=8,color=color(6))
plotshape(size(6)>=0.70?locate(6):na,shape.minus,lwidth,offset=10,color=color(6))
plotshape(size(6)>=0.60?locate(6):na,shape.minus,lwidth,offset=12,color=color(6))
plotshape(size(6)>=0.50?locate(6):na,shape.minus,lwidth,offset=14,color=color(6))
plotshape(size(6)>=0.40?locate(6):na,shape.minus,lwidth,offset=16,color=color(6))
plotshape(size(6)>=0.30?locate(6):na,shape.minus,lwidth,offset=18,color=color(6))
plotshape(size(6)>=0.20?locate(6):na,shape.minus,lwidth,offset=20,color=color(6))
plotshape(size(6)>=0.10?locate(6):na,shape.minus,lwidth,offset=22,color=color(6))
plotshape(size(6)>=0.01?locate(6):na,shape.minus,lwidth,offset=24,color=color(6))

plotshape(size(7)==1.00?locate(7):na,shape.minus,lwidth,offset=4,color=color(7))
plotshape(size(7)>=0.90?locate(7):na,shape.minus,lwidth,offset=6,color=color(7))
plotshape(size(7)>=0.80?locate(7):na,shape.minus,lwidth,offset=8,color=color(7))
plotshape(size(7)>=0.70?locate(7):na,shape.minus,lwidth,offset=10,color=color(7))
plotshape(size(7)>=0.60?locate(7):na,shape.minus,lwidth,offset=12,color=color(7))
plotshape(size(7)>=0.50?locate(7):na,shape.minus,lwidth,offset=14,color=color(7))
plotshape(size(7)>=0.40?locate(7):na,shape.minus,lwidth,offset=16,color=color(7))
plotshape(size(7)>=0.30?locate(7):na,shape.minus,lwidth,offset=18,color=color(7))
plotshape(size(7)>=0.20?locate(7):na,shape.minus,lwidth,offset=20,color=color(7))
plotshape(size(7)>=0.10?locate(7):na,shape.minus,lwidth,offset=22,color=color(7))
plotshape(size(7)>=0.01?locate(7):na,shape.minus,lwidth,offset=24,color=color(7))

plotshape(size(8)==1.00?locate(8):na,shape.minus,lwidth,offset=4,color=color(8))
plotshape(size(8)>=0.90?locate(8):na,shape.minus,lwidth,offset=6,color=color(8))
plotshape(size(8)>=0.80?locate(8):na,shape.minus,lwidth,offset=8,color=color(8))
plotshape(size(8)>=0.70?locate(8):na,shape.minus,lwidth,offset=10,color=color(8))
plotshape(size(8)>=0.60?locate(8):na,shape.minus,lwidth,offset=12,color=color(8))
plotshape(size(8)>=0.50?locate(8):na,shape.minus,lwidth,offset=14,color=color(8))
plotshape(size(8)>=0.40?locate(8):na,shape.minus,lwidth,offset=16,color=color(8))
plotshape(size(8)>=0.30?locate(8):na,shape.minus,lwidth,offset=18,color=color(8))
plotshape(size(8)>=0.20?locate(8):na,shape.minus,lwidth,offset=20,color=color(8))
plotshape(size(8)>=0.10?locate(8):na,shape.minus,lwidth,offset=22,color=color(8))
plotshape(size(8)>=0.01?locate(8):na,shape.minus,lwidth,offset=24,color=color(8))

plotshape(size(9)==1.00?locate(9):na,shape.minus,lwidth,offset=4,color=color(9))
plotshape(size(9)>=0.90?locate(9):na,shape.minus,lwidth,offset=6,color=color(9))
plotshape(size(9)>=0.80?locate(9):na,shape.minus,lwidth,offset=8,color=color(9))
plotshape(size(9)>=0.70?locate(9):na,shape.minus,lwidth,offset=10,color=color(9))
plotshape(size(9)>=0.60?locate(9):na,shape.minus,lwidth,offset=12,color=color(9))
plotshape(size(9)>=0.50?locate(9):na,shape.minus,lwidth,offset=14,color=color(9))
plotshape(size(9)>=0.40?locate(9):na,shape.minus,lwidth,offset=16,color=color(9))
plotshape(size(9)>=0.30?locate(9):na,shape.minus,lwidth,offset=18,color=color(9))
plotshape(size(9)>=0.20?locate(9):na,shape.minus,lwidth,offset=20,color=color(9))
plotshape(size(9)>=0.10?locate(9):na,shape.minus,lwidth,offset=22,color=color(9))
plotshape(size(9)>=0.01?locate(9):na,shape.minus,lwidth,offset=24,color=color(9))

plotshape(size(10)==1.00?locate(10):na,shape.minus,lwidth,offset=4,color=color(10))
plotshape(size(10)>=0.90?locate(10):na,shape.minus,lwidth,offset=6,color=color(10))
plotshape(size(10)>=0.80?locate(10):na,shape.minus,lwidth,offset=8,color=color(10))
plotshape(size(10)>=0.70?locate(10):na,shape.minus,lwidth,offset=10,color=color(10))
plotshape(size(10)>=0.60?locate(10):na,shape.minus,lwidth,offset=12,color=color(10))
plotshape(size(10)>=0.50?locate(10):na,shape.minus,lwidth,offset=14,color=color(10))
plotshape(size(10)>=0.40?locate(10):na,shape.minus,lwidth,offset=16,color=color(10))
plotshape(size(10)>=0.30?locate(10):na,shape.minus,lwidth,offset=18,color=color(10))
plotshape(size(10)>=0.20?locate(10):na,shape.minus,lwidth,offset=20,color=color(10))
plotshape(size(10)>=0.10?locate(10):na,shape.minus,lwidth,offset=22,color=color(10))
plotshape(size(10)>=0.01?locate(10):na,shape.minus,lwidth,offset=24,color=color(10))

plotshape(size(11)==1.00?locate(11):na,shape.minus,lwidth,offset=4,color=color(11))
plotshape(size(11)>=0.90?locate(11):na,shape.minus,lwidth,offset=6,color=color(11))
plotshape(size(11)>=0.80?locate(11):na,shape.minus,lwidth,offset=8,color=color(11))
plotshape(size(11)>=0.70?locate(11):na,shape.minus,lwidth,offset=10,color=color(11))
plotshape(size(11)>=0.60?locate(11):na,shape.minus,lwidth,offset=12,color=color(11))
plotshape(size(11)>=0.50?locate(11):na,shape.minus,lwidth,offset=14,color=color(11))
plotshape(size(11)>=0.40?locate(11):na,shape.minus,lwidth,offset=16,color=color(11))
plotshape(size(11)>=0.30?locate(11):na,shape.minus,lwidth,offset=18,color=color(11))
plotshape(size(11)>=0.20?locate(11):na,shape.minus,lwidth,offset=20,color=color(11))
plotshape(size(11)>=0.10?locate(11):na,shape.minus,lwidth,offset=22,color=color(11))
plotshape(size(11)>=0.01?locate(11):na,shape.minus,lwidth,offset=24,color=color(11))

plotshape(size(12)==1.00?locate(12):na,shape.minus,lwidth,offset=4,color=color(12))
plotshape(size(12)>=0.90?locate(12):na,shape.minus,lwidth,offset=6,color=color(12))
plotshape(size(12)>=0.80?locate(12):na,shape.minus,lwidth,offset=8,color=color(12))
plotshape(size(12)>=0.70?locate(12):na,shape.minus,lwidth,offset=10,color=color(12))
plotshape(size(12)>=0.60?locate(12):na,shape.minus,lwidth,offset=12,color=color(12))
plotshape(size(12)>=0.50?locate(12):na,shape.minus,lwidth,offset=14,color=color(12))
plotshape(size(12)>=0.40?locate(12):na,shape.minus,lwidth,offset=16,color=color(12))
plotshape(size(12)>=0.30?locate(12):na,shape.minus,lwidth,offset=18,color=color(12))
plotshape(size(12)>=0.20?locate(12):na,shape.minus,lwidth,offset=20,color=color(12))
plotshape(size(12)>=0.10?locate(12):na,shape.minus,lwidth,offset=22,color=color(12))
plotshape(size(12)>=0.01?locate(12):na,shape.minus,lwidth,offset=24,color=color(12))

plotshape(size(13)==1.00?locate(13):na,shape.minus,lwidth,offset=4,color=color(13))
plotshape(size(13)>=0.90?locate(13):na,shape.minus,lwidth,offset=6,color=color(13))
plotshape(size(13)>=0.80?locate(13):na,shape.minus,lwidth,offset=8,color=color(13))
plotshape(size(13)>=0.70?locate(13):na,shape.minus,lwidth,offset=10,color=color(13))
plotshape(size(13)>=0.60?locate(13):na,shape.minus,lwidth,offset=12,color=color(13))
plotshape(size(13)>=0.50?locate(13):na,shape.minus,lwidth,offset=14,color=color(13))
plotshape(size(13)>=0.40?locate(13):na,shape.minus,lwidth,offset=16,color=color(13))
plotshape(size(13)>=0.30?locate(13):na,shape.minus,lwidth,offset=18,color=color(13))
plotshape(size(13)>=0.20?locate(13):na,shape.minus,lwidth,offset=20,color=color(13))
plotshape(size(13)>=0.10?locate(13):na,shape.minus,lwidth,offset=22,color=color(13))
plotshape(size(13)>=0.01?locate(13):na,shape.minus,lwidth,offset=24,color=color(13))

plotshape(size(14)==1.00?locate(14):na,shape.minus,lwidth,offset=4,color=color(14))
plotshape(size(14)>=0.90?locate(14):na,shape.minus,lwidth,offset=6,color=color(14))
plotshape(size(14)>=0.80?locate(14):na,shape.minus,lwidth,offset=8,color=color(14))
plotshape(size(14)>=0.70?locate(14):na,shape.minus,lwidth,offset=10,color=color(14))
plotshape(size(14)>=0.60?locate(14):na,shape.minus,lwidth,offset=12,color=color(14))
plotshape(size(14)>=0.50?locate(14):na,shape.minus,lwidth,offset=14,color=color(14))
plotshape(size(14)>=0.40?locate(14):na,shape.minus,lwidth,offset=16,color=color(14))
plotshape(size(14)>=0.30?locate(14):na,shape.minus,lwidth,offset=18,color=color(14))
plotshape(size(14)>=0.20?locate(14):na,shape.minus,lwidth,offset=20,color=color(14))
plotshape(size(14)>=0.10?locate(14):na,shape.minus,lwidth,offset=22,color=color(14))
plotshape(size(14)>=0.01?locate(14):na,shape.minus,lwidth,offset=24,color=color(14))

plotshape(size(15)==1.00?locate(15):na,shape.minus,lwidth,offset=4,color=color(15))
plotshape(size(15)>=0.90?locate(15):na,shape.minus,lwidth,offset=6,color=color(15))
plotshape(size(15)>=0.80?locate(15):na,shape.minus,lwidth,offset=8,color=color(15))
plotshape(size(15)>=0.70?locate(15):na,shape.minus,lwidth,offset=10,color=color(15))
plotshape(size(15)>=0.60?locate(15):na,shape.minus,lwidth,offset=12,color=color(15))
plotshape(size(15)>=0.50?locate(15):na,shape.minus,lwidth,offset=14,color=color(15))
plotshape(size(15)>=0.40?locate(15):na,shape.minus,lwidth,offset=16,color=color(15))
plotshape(size(15)>=0.30?locate(15):na,shape.minus,lwidth,offset=18,color=color(15))
plotshape(size(15)>=0.20?locate(15):na,shape.minus,lwidth,offset=20,color=color(15))
plotshape(size(15)>=0.10?locate(15):na,shape.minus,lwidth,offset=22,color=color(15))
plotshape(size(15)>=0.01?locate(15):na,shape.minus,lwidth,offset=24,color=color(15))

plotshape(size(16)==1.00?locate(16):na,shape.minus,lwidth,offset=4,color=color(16))
plotshape(size(16)>=0.90?locate(16):na,shape.minus,lwidth,offset=6,color=color(16))
plotshape(size(16)>=0.80?locate(16):na,shape.minus,lwidth,offset=8,color=color(16))
plotshape(size(16)>=0.70?locate(16):na,shape.minus,lwidth,offset=10,color=color(16))
plotshape(size(16)>=0.60?locate(16):na,shape.minus,lwidth,offset=12,color=color(16))
plotshape(size(16)>=0.50?locate(16):na,shape.minus,lwidth,offset=14,color=color(16))
plotshape(size(16)>=0.40?locate(16):na,shape.minus,lwidth,offset=16,color=color(16))
plotshape(size(16)>=0.30?locate(16):na,shape.minus,lwidth,offset=18,color=color(16))
plotshape(size(16)>=0.20?locate(16):na,shape.minus,lwidth,offset=20,color=color(16))
plotshape(size(16)>=0.10?locate(16):na,shape.minus,lwidth,offset=22,color=color(16))
plotshape(size(16)>=0.01?locate(16):na,shape.minus,lwidth,offset=24,color=color(16))

plotshape(size(17)==1.00?locate(17):na,shape.minus,lwidth,offset=4,color=color(17))
plotshape(size(17)>=0.90?locate(17):na,shape.minus,lwidth,offset=6,color=color(17))
plotshape(size(17)>=0.80?locate(17):na,shape.minus,lwidth,offset=8,color=color(17))
plotshape(size(17)>=0.70?locate(17):na,shape.minus,lwidth,offset=10,color=color(17))
plotshape(size(17)>=0.60?locate(17):na,shape.minus,lwidth,offset=12,color=color(17))
plotshape(size(17)>=0.50?locate(17):na,shape.minus,lwidth,offset=14,color=color(17))
plotshape(size(17)>=0.40?locate(17):na,shape.minus,lwidth,offset=16,color=color(17))
plotshape(size(17)>=0.30?locate(17):na,shape.minus,lwidth,offset=18,color=color(17))
plotshape(size(17)>=0.20?locate(17):na,shape.minus,lwidth,offset=20,color=color(17))
plotshape(size(17)>=0.10?locate(17):na,shape.minus,lwidth,offset=22,color=color(17))
plotshape(size(17)>=0.01?locate(17):na,shape.minus,lwidth,offset=24,color=color(17))

plotshape(size(18)==1.00?locate(18):na,shape.minus,lwidth,offset=4,color=color(18))
plotshape(size(18)>=0.90?locate(18):na,shape.minus,lwidth,offset=6,color=color(18))
plotshape(size(18)>=0.80?locate(18):na,shape.minus,lwidth,offset=8,color=color(18))
plotshape(size(18)>=0.70?locate(18):na,shape.minus,lwidth,offset=10,color=color(18))
plotshape(size(18)>=0.60?locate(18):na,shape.minus,lwidth,offset=12,color=color(18))
plotshape(size(18)>=0.50?locate(18):na,shape.minus,lwidth,offset=14,color=color(18))
plotshape(size(18)>=0.40?locate(18):na,shape.minus,lwidth,offset=16,color=color(18))
plotshape(size(18)>=0.30?locate(18):na,shape.minus,lwidth,offset=18,color=color(18))
plotshape(size(18)>=0.20?locate(18):na,shape.minus,lwidth,offset=20,color=color(18))
plotshape(size(18)>=0.10?locate(18):na,shape.minus,lwidth,offset=22,color=color(18))
plotshape(size(18)>=0.01?locate(18):na,shape.minus,lwidth,offset=24,color=color(18))

plotshape(size(19)==1.00?locate(19):na,shape.minus,lwidth,offset=4,color=color(19))
plotshape(size(19)>=0.90?locate(19):na,shape.minus,lwidth,offset=6,color=color(19))
plotshape(size(19)>=0.80?locate(19):na,shape.minus,lwidth,offset=8,color=color(19))
plotshape(size(19)>=0.70?locate(19):na,shape.minus,lwidth,offset=10,color=color(19))
plotshape(size(19)>=0.60?locate(19):na,shape.minus,lwidth,offset=12,color=color(19))
plotshape(size(19)>=0.50?locate(19):na,shape.minus,lwidth,offset=14,color=color(19))
plotshape(size(19)>=0.40?locate(19):na,shape.minus,lwidth,offset=16,color=color(19))
plotshape(size(19)>=0.30?locate(19):na,shape.minus,lwidth,offset=18,color=color(19))
plotshape(size(19)>=0.20?locate(19):na,shape.minus,lwidth,offset=20,color=color(19))
plotshape(size(19)>=0.10?locate(19):na,shape.minus,lwidth,offset=22,color=color(19))
plotshape(size(19)>=0.01?locate(19):na,shape.minus,lwidth,offset=24,color=color(19))

plotshape(size(20)==1.00?locate(20):na,shape.minus,lwidth,offset=4,color=color(20))
plotshape(size(20)>=0.90?locate(20):na,shape.minus,lwidth,offset=6,color=color(20))
plotshape(size(20)>=0.80?locate(20):na,shape.minus,lwidth,offset=8,color=color(20))
plotshape(size(20)>=0.70?locate(20):na,shape.minus,lwidth,offset=10,color=color(20))
plotshape(size(20)>=0.60?locate(20):na,shape.minus,lwidth,offset=12,color=color(20))
plotshape(size(20)>=0.50?locate(20):na,shape.minus,lwidth,offset=14,color=color(20))
plotshape(size(20)>=0.40?locate(20):na,shape.minus,lwidth,offset=16,color=color(20))
plotshape(size(20)>=0.30?locate(20):na,shape.minus,lwidth,offset=18,color=color(20))
plotshape(size(20)>=0.20?locate(20):na,shape.minus,lwidth,offset=20,color=color(20))
plotshape(size(20)>=0.10?locate(20):na,shape.minus,lwidth,offset=22,color=color(20))
plotshape(size(20)>=0.01?locate(20):na,shape.minus,lwidth,offset=24,color=color(20))

plotshape(size(21)==1.00?locate(21):na,shape.minus,lwidth,offset=4,color=color(21))
plotshape(size(21)>=0.90?locate(21):na,shape.minus,lwidth,offset=6,color=color(21))
plotshape(size(21)>=0.80?locate(21):na,shape.minus,lwidth,offset=8,color=color(21))
plotshape(size(21)>=0.70?locate(21):na,shape.minus,lwidth,offset=10,color=color(21))
plotshape(size(21)>=0.60?locate(21):na,shape.minus,lwidth,offset=12,color=color(21))
plotshape(size(21)>=0.50?locate(21):na,shape.minus,lwidth,offset=14,color=color(21))
plotshape(size(21)>=0.40?locate(21):na,shape.minus,lwidth,offset=16,color=color(21))
plotshape(size(21)>=0.30?locate(21):na,shape.minus,lwidth,offset=18,color=color(21))
plotshape(size(21)>=0.20?locate(21):na,shape.minus,lwidth,offset=20,color=color(21))
plotshape(size(21)>=0.10?locate(21):na,shape.minus,lwidth,offset=22,color=color(21))
plotshape(size(21)>=0.01?locate(21):na,shape.minus,lwidth,offset=24,color=color(21))

plotshape(size(22)==1.00?locate(22):na,shape.minus,lwidth,offset=4,color=color(22))
plotshape(size(22)>=0.90?locate(22):na,shape.minus,lwidth,offset=6,color=color(22))
plotshape(size(22)>=0.80?locate(22):na,shape.minus,lwidth,offset=8,color=color(22))
plotshape(size(22)>=0.70?locate(22):na,shape.minus,lwidth,offset=10,color=color(22))
plotshape(size(22)>=0.60?locate(22):na,shape.minus,lwidth,offset=12,color=color(22))
plotshape(size(22)>=0.50?locate(22):na,shape.minus,lwidth,offset=14,color=color(22))
plotshape(size(22)>=0.40?locate(22):na,shape.minus,lwidth,offset=16,color=color(22))
plotshape(size(22)>=0.30?locate(22):na,shape.minus,lwidth,offset=18,color=color(22))
plotshape(size(22)>=0.20?locate(22):na,shape.minus,lwidth,offset=20,color=color(22))
plotshape(size(22)>=0.10?locate(22):na,shape.minus,lwidth,offset=22,color=color(22))
plotshape(size(22)>=0.01?locate(22):na,shape.minus,lwidth,offset=24,color=color(22))

plotshape(size(23)==1.00?locate(23):na,shape.minus,lwidth,offset=4,color=color(23))
plotshape(size(23)>=0.90?locate(23):na,shape.minus,lwidth,offset=6,color=color(23))
plotshape(size(23)>=0.80?locate(23):na,shape.minus,lwidth,offset=8,color=color(23))
plotshape(size(23)>=0.70?locate(23):na,shape.minus,lwidth,offset=10,color=color(23))
plotshape(size(23)>=0.60?locate(23):na,shape.minus,lwidth,offset=12,color=color(23))
plotshape(size(23)>=0.50?locate(23):na,shape.minus,lwidth,offset=14,color=color(23))
plotshape(size(23)>=0.40?locate(23):na,shape.minus,lwidth,offset=16,color=color(23))
plotshape(size(23)>=0.30?locate(23):na,shape.minus,lwidth,offset=18,color=color(23))
plotshape(size(23)>=0.20?locate(23):na,shape.minus,lwidth,offset=20,color=color(23))
plotshape(size(23)>=0.10?locate(23):na,shape.minus,lwidth,offset=22,color=color(23))
plotshape(size(23)>=0.01?locate(23):na,shape.minus,lwidth,offset=24,color=color(23))

plotshape(size(24)==1.00?locate(24):na,shape.minus,lwidth,offset=4,color=color(24))
plotshape(size(24)>=0.90?locate(24):na,shape.minus,lwidth,offset=6,color=color(24))
plotshape(size(24)>=0.80?locate(24):na,shape.minus,lwidth,offset=8,color=color(24))
plotshape(size(24)>=0.70?locate(24):na,shape.minus,lwidth,offset=10,color=color(24))
plotshape(size(24)>=0.60?locate(24):na,shape.minus,lwidth,offset=12,color=color(24))
plotshape(size(24)>=0.50?locate(24):na,shape.minus,lwidth,offset=14,color=color(24))
plotshape(size(24)>=0.40?locate(24):na,shape.minus,lwidth,offset=16,color=color(24))
plotshape(size(24)>=0.30?locate(24):na,shape.minus,lwidth,offset=18,color=color(24))
plotshape(size(24)>=0.20?locate(24):na,shape.minus,lwidth,offset=20,color=color(24))
plotshape(size(24)>=0.10?locate(24):na,shape.minus,lwidth,offset=22,color=color(24))
plotshape(size(24)>=0.01?locate(24):na,shape.minus,lwidth,offset=24,color=color(24))

plotshape(size(25)==1.00?locate(25):na,shape.minus,lwidth,offset=4,color=color(25))
plotshape(size(25)>=0.90?locate(25):na,shape.minus,lwidth,offset=6,color=color(25))
plotshape(size(25)>=0.80?locate(25):na,shape.minus,lwidth,offset=8,color=color(25))
plotshape(size(25)>=0.70?locate(25):na,shape.minus,lwidth,offset=10,color=color(25))
plotshape(size(25)>=0.60?locate(25):na,shape.minus,lwidth,offset=12,color=color(25))
plotshape(size(25)>=0.50?locate(25):na,shape.minus,lwidth,offset=14,color=color(25))
plotshape(size(25)>=0.40?locate(25):na,shape.minus,lwidth,offset=16,color=color(25))
plotshape(size(25)>=0.30?locate(25):na,shape.minus,lwidth,offset=18,color=color(25))
plotshape(size(25)>=0.20?locate(25):na,shape.minus,lwidth,offset=20,color=color(25))
plotshape(size(25)>=0.10?locate(25):na,shape.minus,lwidth,offset=22,color=color(25))
plotshape(size(25)>=0.01?locate(25):na,shape.minus,lwidth,offset=24,color=color(25))
