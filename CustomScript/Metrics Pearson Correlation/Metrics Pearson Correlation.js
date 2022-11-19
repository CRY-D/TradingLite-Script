//@version=1 //by SMG
study("Metrics Pearson Correlation")
const length = input('length',60)
func corr(x:seq,y:seq,m:var){
  seq a = x*y
  var cov = sma(a,m) - sma(x,m)*sma(y,m),
    den = stdev(x,m)*stdev(y,m)
  return cov/den
}
header('')
const dataMetricsA = input("Metrics A", 'Price', options=['Price','CVD','Open Interest','CLD','Funding Rate'])
seq metricsA = 1
switch(dataMetricsA){
  case 'Price':
     metricsA = 1
     break
  case 'CVD':
     metricsA = 2
     break
  case 'Open Interest':
     metricsA = 3
     break
  case 'CLD':
     metricsA = 4
     break
  case 'Funding Rate':
     metricsA = 5
     break
}
const dataMetricsB = input("Metrics B", 'Open Interest', options=['Price','CVD','Open Interest','CLD','Funding Rate'])
seq metricsB = 1
switch(dataMetricsB){
  case 'Price':
     metricsB = 1
     break
  case 'CVD':
     metricsB = 2
     break
  case 'Open Interest':
     metricsB = 3
     break
  case 'CLD':
     metricsB = 4
     break
  case 'Funding Rate':
     metricsB = 5
     break
}
seq vd = vbuy-vsell, cvd = cum(vd)
seq ld = liq_ask-liq_bid, cld = cum(ld)
//
seq A = 
  metricsA==1?close:
  metricsA==2?cvd:
  metricsA==3?oi_close:
  metricsA==4?cld:
  metricsA==5?funding:
  close
//
seq B = 
  metricsB==1?close:
  metricsB==2?cvd:
  metricsB==3?oi_close:
  metricsB==4?cld:
  metricsB==5?funding:
  close
//
header('')
const color_a = input("",color.white),
  color_b = input("",color.gray)
const color = blend(color_b,color_a,corr(A,B,length))
plot(corr(A,B,length), linewidth=2, color=color) 