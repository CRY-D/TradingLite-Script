//@version=1 //by SMG
study("VOL")
const dataSrc = input("Data Source", 'close', options=['open','high','low','close','ohlc4','hlc3','hl2','vbuy','vsell','oi_open','oi_high','oi_low','oi_close','oi_ohlc4','oi_hlc3','oi_hl2','liq_ask','liq_bid','funding','funding_predicted','mark_price','volume'])

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
  case 'vbuy':
     src = vbuy
     break
  case 'vsell':
     src = vsell
     break
  case 'oi_open':
     src = oi_open
     break
  case 'oi_high':
     src = oi_high
     break
  case 'oi_low':
     src = oi_low
     break
  case 'oi_close':
     src = oi_close
     break
  case 'oi_ohlc4':
     src = oi_ohlc4
     break
  case 'oi_hlc3':
     src = oi_hlc3
     break
  case 'oi_hl2':
     src = oi_hl2
     break
  case 'liq_ask':
     src = liq_ask
     break
  case 'liq_bid':
     src = liq_bid
     break
  case 'funding':
     src = funding
     break
  case 'funding_predicted':
     src = funding_predicted
     break
  case 'mark_price':
     src = mark_price
     break
  case 'volume':
     src = vbuy+vsell
     break
}

header('Plot')
const show_d = input("Show VOL24H",true)
const show_7d = input("Show VOL7D",false)
header('')
const show_custom = input('Show Custom Historical Vol',false)
const custom_timeframe = input("Timeframe", 'Chart', options=['Chart','1m','3m','5m','15m','30m','1h','2h','4h','6h','8h','12h','D'])
seq tf = 0
switch(custom_timeframe){
  case 'Chart':
     tf = 0
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
}
const 
  custom_length = input('Length',10),
  custom_length_adjusted = tf==0?custom_length:custom_length*tf

//Calculation
seq r=(log(src[1]/src))
seq v_d = bar_index>1440/timeframe?stdev(r,1440/timeframe)*sqrt(1440/timeframe):na
seq v_7d= bar_index>10080/timeframe?stdev(r,10080/timeframe)*sqrt(10080/timeframe):na

seq v_custom = bar_index>custom_length_adjusted?stdev(r,custom_length_adjusted)*sqrt(custom_length_adjusted):na

//
header('Color')
const color_d=input("VOL24H",color.silver)
const color_7d=input("VOL7D",color.gray)
header('')
const color_custom=input("Custom HV",#0061FFFF)

//
plot(show_d?v_d*100:na,color=color_d,linewidth=2)
plot(show_7d?v_7d*100:na,color=color_7d,linewidth=2)
plot(show_custom?v_custom*100:na,color=color_custom,linewidth=2)
