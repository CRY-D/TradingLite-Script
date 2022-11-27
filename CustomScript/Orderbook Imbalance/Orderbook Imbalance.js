//@version=1 //by SMG
study("Orderbook Imbalance")
const depth = input("Depth", 2.5, maxval=25 , minval=0, step=0.01)

seq bid = bid_sum(depth)
seq ask = ask_sum(depth)
seq obi = (bid-ask)/(bid+ask)

header('Color')
const color_pos = input("Positive",#2196F3FF)
const color_neg = input("Negative", color.red)
seq color = obi>0?color_pos:color_neg

histogram(obi,color=color)