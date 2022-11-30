//@version=1 //by SMG
study("Volume")
const 
  color_total = input('Total',color.gray)
header('')
const 
  switch_color = input('Switch Total Volume Color',false)
const
  color_vbuy = input("Buys",color.lime),
  color_vsell = input("Sells",color.red)

seq v = vbuy+vsell, d = vbuy-vsell
seq color_v = d>0?color_vbuy:color_vsell
seq color = switch_color? color_v : color_total

histogram(v, color=color,transp=80)
histogram(vbuy, color=color_vbuy, width=0.08, offset=0) 
histogram(vsell,color=color_vsell, width=0.08, offset=-0.1) 