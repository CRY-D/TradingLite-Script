//@version=1 //by SMG
//Unless you manually set High and Low, it won't display well.
study("Open Interest Profile/ Fixed Range",overlay=true)
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
header('')
const dataHLSrc = input("Data Source(Scale Range)", 'Auto(Lookback Period)', options=['Auto(Lookback Period)','Custom'])
seq hl_src = 1
switch(dataHLSrc){
  case 'Auto(Lookback Period)':
     hl_src = 1
     break
  case 'Custom':
     hl_src = 2
     break
}
const high_custom = input('High[Custom]',0), low_custom = input('Low[Custom]',0)
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
var lb = input('Bars [Lookback Period in Bars]',300),lb_ = input('Days [Lookback Period in Days]',1),
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
  show_start = input("Show Start Location",true),
  locate_cond = start==0?t<=bars&t>=bars_:
     start==1?t>(8.64e7*(lb_-timeframe/1440))&t<days:
     start==2?time[1]<ts&time>=ts:na

bgcolor(show_start&locate_cond ? #FFFFFF50:na)
//
seq oid = cond?oi_src-oi_src[1]:0, 
  data=oip_var==1?oid>0?oid:0:
  oip_var==2?oid<0?oid:0:
  oip_var==3?oid:0
//
seq length = start==0?lb:
  start==1?lb_*1440/timeframe:
  start==2?((time-ts)/t_adj):0
//
seq h = hl_src==1?highest(high,length):hl_src==2?high_custom:highest(high,length),
  l = hl_src==1?lowest(low,length):hl_src==2?low_custom:lowest(low,length)
//
header('Row size','')
const row = input('Number of Rows', 48,minval=1, maxval=100,step=1)
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
const lor = input('Width ↔(Bars)',30,minval=1,maxval=100,step=1)
func size(n:var){
  seq oip = cal_profile(n), 
    size_=abs(oip)/poc*lor
  return size_
}
//
const adjust_width = input('Width ↕(%)',80,minval=1,maxval=100,step=1),
  density = width*adjust_width/100
//location
func locate(n:var){
  var locate_ = 0
  if (n<=(row+1)){
    locate_ = t<t_adj*size(n) ? l+(width*(n-1)) : na
  }
  return locate_
}
header('Color')
//color
const col_pos = input('OI Increased',color.yellow), col_neg =input('OI Decreased', color.magenta)
//header('')
func color(n:var){
  var color_ = #FFFFFF00
  if (t<t_adj*size(n)){
    color_ = cal_profile(n)>0?col_pos:col_neg
  }
  return color_
}
const transp_per = input('Transparency(%)',0,minval=0,maxval=100,step=1), transp = transp_per/100
//plot
header('')
const back = input('Fill Background', false),
  color_bg = input('',#00FFA820)
fill(t>=t_adj*lor?na:back?l:na,h,color=color_bg,offset=30)
//
fill(locate(1),locate(1)+density,offset=30,color=blend(color(1),#FFFFFF00,transp))
fill(locate(2),locate(2)+density,offset=30,color=blend(color(2),#FFFFFF00,transp))
fill(locate(3),locate(3)+density,offset=30,color=blend(color(3),#FFFFFF00,transp))
fill(locate(4),locate(4)+density,offset=30,color=blend(color(4),#FFFFFF00,transp))
fill(locate(5),locate(5)+density,offset=30,color=blend(color(5),#FFFFFF00,transp))
fill(locate(6),locate(6)+density,offset=30,color=blend(color(6),#FFFFFF00,transp))
fill(locate(7),locate(7)+density,offset=30,color=blend(color(7),#FFFFFF00,transp))
fill(locate(8),locate(8)+density,offset=30,color=blend(color(8),#FFFFFF00,transp))
fill(locate(9),locate(9)+density,offset=30,color=blend(color(9),#FFFFFF00,transp))
fill(locate(10),locate(10)+density,offset=30,color=blend(color(10),#FFFFFF00,transp))
fill(locate(11),locate(11)+density,offset=30,color=blend(color(11),#FFFFFF00,transp))
fill(locate(12),locate(12)+density,offset=30,color=blend(color(12),#FFFFFF00,transp))
fill(locate(13),locate(13)+density,offset=30,color=blend(color(13),#FFFFFF00,transp))
fill(locate(14),locate(14)+density,offset=30,color=blend(color(14),#FFFFFF00,transp))
fill(locate(15),locate(15)+density,offset=30,color=blend(color(15),#FFFFFF00,transp))
fill(locate(16),locate(16)+density,offset=30,color=blend(color(16),#FFFFFF00,transp))
fill(locate(17),locate(17)+density,offset=30,color=blend(color(17),#FFFFFF00,transp))
fill(locate(18),locate(18)+density,offset=30,color=blend(color(18),#FFFFFF00,transp))
fill(locate(19),locate(19)+density,offset=30,color=blend(color(19),#FFFFFF00,transp))
fill(locate(20),locate(20)+density,offset=30,color=blend(color(20),#FFFFFF00,transp))
fill(locate(21),locate(21)+density,offset=30,color=blend(color(21),#FFFFFF00,transp))
fill(locate(22),locate(22)+density,offset=30,color=blend(color(22),#FFFFFF00,transp))
fill(locate(23),locate(23)+density,offset=30,color=blend(color(23),#FFFFFF00,transp))
fill(locate(24),locate(24)+density,offset=30,color=blend(color(24),#FFFFFF00,transp))
fill(locate(25),locate(25)+density,offset=30,color=blend(color(25),#FFFFFF00,transp))
fill(locate(26),locate(26)+density,offset=30,color=blend(color(26),#FFFFFF00,transp))
fill(locate(27),locate(27)+density,offset=30,color=blend(color(27),#FFFFFF00,transp))
fill(locate(28),locate(28)+density,offset=30,color=blend(color(28),#FFFFFF00,transp))
fill(locate(29),locate(29)+density,offset=30,color=blend(color(29),#FFFFFF00,transp))
fill(locate(30),locate(30)+density,offset=30,color=blend(color(30),#FFFFFF00,transp))
fill(locate(31),locate(31)+density,offset=30,color=blend(color(31),#FFFFFF00,transp))
fill(locate(32),locate(32)+density,offset=30,color=blend(color(32),#FFFFFF00,transp))
fill(locate(33),locate(33)+density,offset=30,color=blend(color(33),#FFFFFF00,transp))
fill(locate(34),locate(34)+density,offset=30,color=blend(color(34),#FFFFFF00,transp))
fill(locate(35),locate(35)+density,offset=30,color=blend(color(35),#FFFFFF00,transp))
fill(locate(36),locate(36)+density,offset=30,color=blend(color(36),#FFFFFF00,transp))
fill(locate(37),locate(37)+density,offset=30,color=blend(color(37),#FFFFFF00,transp))
fill(locate(38),locate(38)+density,offset=30,color=blend(color(38),#FFFFFF00,transp))
fill(locate(39),locate(39)+density,offset=30,color=blend(color(39),#FFFFFF00,transp))
fill(locate(40),locate(40)+density,offset=30,color=blend(color(40),#FFFFFF00,transp))
fill(locate(41),locate(41)+density,offset=30,color=blend(color(41),#FFFFFF00,transp))
fill(locate(42),locate(42)+density,offset=30,color=blend(color(42),#FFFFFF00,transp))
fill(locate(43),locate(43)+density,offset=30,color=blend(color(43),#FFFFFF00,transp))
fill(locate(44),locate(44)+density,offset=30,color=blend(color(44),#FFFFFF00,transp))
fill(locate(45),locate(45)+density,offset=30,color=blend(color(45),#FFFFFF00,transp))
fill(locate(46),locate(46)+density,offset=30,color=blend(color(46),#FFFFFF00,transp))
fill(locate(47),locate(47)+density,offset=30,color=blend(color(47),#FFFFFF00,transp))
fill(locate(48),locate(48)+density,offset=30,color=blend(color(48),#FFFFFF00,transp))
fill(locate(49),locate(49)+density,offset=30,color=blend(color(49),#FFFFFF00,transp))
fill(locate(50),locate(50)+density,offset=30,color=blend(color(50),#FFFFFF00,transp))
fill(locate(51),locate(51)+density,offset=30,color=blend(color(51),#FFFFFF00,transp))
fill(locate(52),locate(52)+density,offset=30,color=blend(color(52),#FFFFFF00,transp))
fill(locate(53),locate(53)+density,offset=30,color=blend(color(53),#FFFFFF00,transp))
fill(locate(54),locate(54)+density,offset=30,color=blend(color(54),#FFFFFF00,transp))
fill(locate(55),locate(55)+density,offset=30,color=blend(color(55),#FFFFFF00,transp))
fill(locate(56),locate(56)+density,offset=30,color=blend(color(56),#FFFFFF00,transp))
fill(locate(57),locate(57)+density,offset=30,color=blend(color(57),#FFFFFF00,transp))
fill(locate(58),locate(58)+density,offset=30,color=blend(color(58),#FFFFFF00,transp))
fill(locate(59),locate(59)+density,offset=30,color=blend(color(59),#FFFFFF00,transp))
fill(locate(60),locate(60)+density,offset=30,color=blend(color(60),#FFFFFF00,transp))
fill(locate(61),locate(61)+density,offset=30,color=blend(color(61),#FFFFFF00,transp))
fill(locate(62),locate(62)+density,offset=30,color=blend(color(62),#FFFFFF00,transp))
fill(locate(63),locate(63)+density,offset=30,color=blend(color(63),#FFFFFF00,transp))
fill(locate(64),locate(64)+density,offset=30,color=blend(color(64),#FFFFFF00,transp))
fill(locate(65),locate(65)+density,offset=30,color=blend(color(65),#FFFFFF00,transp))
fill(locate(66),locate(66)+density,offset=30,color=blend(color(66),#FFFFFF00,transp))
fill(locate(67),locate(67)+density,offset=30,color=blend(color(67),#FFFFFF00,transp))
fill(locate(68),locate(68)+density,offset=30,color=blend(color(68),#FFFFFF00,transp))
fill(locate(69),locate(69)+density,offset=30,color=blend(color(69),#FFFFFF00,transp))
fill(locate(70),locate(70)+density,offset=30,color=blend(color(70),#FFFFFF00,transp))
fill(locate(71),locate(71)+density,offset=30,color=blend(color(71),#FFFFFF00,transp))
fill(locate(72),locate(72)+density,offset=30,color=blend(color(72),#FFFFFF00,transp))
fill(locate(73),locate(73)+density,offset=30,color=blend(color(73),#FFFFFF00,transp))
fill(locate(74),locate(74)+density,offset=30,color=blend(color(74),#FFFFFF00,transp))
fill(locate(75),locate(75)+density,offset=30,color=blend(color(75),#FFFFFF00,transp))
fill(locate(76),locate(76)+density,offset=30,color=blend(color(76),#FFFFFF00,transp))
fill(locate(77),locate(77)+density,offset=30,color=blend(color(77),#FFFFFF00,transp))
fill(locate(78),locate(78)+density,offset=30,color=blend(color(78),#FFFFFF00,transp))
fill(locate(79),locate(79)+density,offset=30,color=blend(color(79),#FFFFFF00,transp))
fill(locate(80),locate(80)+density,offset=30,color=blend(color(80),#FFFFFF00,transp))
fill(locate(81),locate(81)+density,offset=30,color=blend(color(81),#FFFFFF00,transp))
fill(locate(82),locate(82)+density,offset=30,color=blend(color(82),#FFFFFF00,transp))
fill(locate(83),locate(83)+density,offset=30,color=blend(color(83),#FFFFFF00,transp))
fill(locate(84),locate(84)+density,offset=30,color=blend(color(84),#FFFFFF00,transp))
fill(locate(85),locate(85)+density,offset=30,color=blend(color(85),#FFFFFF00,transp))
fill(locate(86),locate(86)+density,offset=30,color=blend(color(86),#FFFFFF00,transp))
fill(locate(87),locate(87)+density,offset=30,color=blend(color(87),#FFFFFF00,transp))
fill(locate(88),locate(88)+density,offset=30,color=blend(color(88),#FFFFFF00,transp))
fill(locate(89),locate(89)+density,offset=30,color=blend(color(89),#FFFFFF00,transp))
fill(locate(90),locate(90)+density,offset=30,color=blend(color(90),#FFFFFF00,transp))
fill(locate(91),locate(91)+density,offset=30,color=blend(color(91),#FFFFFF00,transp))
fill(locate(92),locate(92)+density,offset=30,color=blend(color(92),#FFFFFF00,transp))
fill(locate(93),locate(93)+density,offset=30,color=blend(color(93),#FFFFFF00,transp))
fill(locate(94),locate(94)+density,offset=30,color=blend(color(94),#FFFFFF00,transp))
fill(locate(95),locate(95)+density,offset=30,color=blend(color(95),#FFFFFF00,transp))
fill(locate(96),locate(96)+density,offset=30,color=blend(color(96),#FFFFFF00,transp))
fill(locate(97),locate(97)+density,offset=30,color=blend(color(97),#FFFFFF00,transp))
fill(locate(98),locate(98)+density,offset=30,color=blend(color(98),#FFFFFF00,transp))
fill(locate(99),locate(99)+density,offset=30,color=blend(color(99),#FFFFFF00,transp))
fill(locate(100),locate(100)+density,offset=30,color=blend(color(100),#FFFFFF00,transp))