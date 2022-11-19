//@version=1 //by SMG
study("CME Gap",overlay=true)
header('','Gap line')
const plot_the_line = input('CME Friday Close',true)
const color_line = input('',color.magenta)

header('','Background')
const fill_the_gap = input("Fill",true)
const 
  color_above = input("Above Gap",color.red),
  color_below = input("Below Gap",color.green)

seq 
  dow = dayofweek(time),
  day = floor((time/1000-1576022400)/86400)
//friday
seq 
  fri_o = floor((time/1000-1576022400+3600*(24-21))/86400),
  fri_c = floor((time/1000-1576022400+3600*(24-24))/86400),
  fri = (dow==5&day!=fri_o) and (dow==5&day==fri_c)
//saturday
seq sat = dow==6
//sunday
seq 
  sun_o = floor((time/1000-1576022400+3600*(24))/86400),
  sun_c = floor((time/1000-1576022400+3600*(24-22))/86400),
  sun = (dow==0&day!=sun_o) and (dow==0&day==sun_c)

seq cme_closed = fri or sat or sun 

//
seq c = 0
c = cme_closed ? c[1] : close
seq gap = cme_closed!=0?c:close[1]
//

seq color_bg = #FFFFFF00
if (gap>close) {color_bg = color_above} 
else if (gap<close) {color_bg = color_below}

plot(plot_the_line&cme_closed?gap:na, linewidth=2, color=color_line)
fill(fill_the_gap&cme_closed?gap:na, close, color=color_bg, transp=70)