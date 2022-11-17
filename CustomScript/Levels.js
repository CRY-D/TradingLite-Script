//@version=1
study("Levels", overlay=true)
header('Mode')
const datamode = input("mode", 'plotshape', options=['Line','plotshape'])
seq mode = 1
switch(datamode){
  case 'Line':
     mode=1
     break
  case 'plotshape':
     mode=2
     break
}
//
header("Daily Open")
const show_day = input("Daily Open", true),
  col_day = input("", color.magenta),
  size_day = input("Line size[plotshape]", 4, minval=1, maxval = 10, step=1)
header('Weekly Open')
const show_week = input("Weekly Open", true),
  col_week = input("", color.yellow),
  size_week = input("Line size[plotshape]", 6, minval=1, maxval = 10, step=1)
header('Monthly Open')
const show_month= input("Monthly Open", false),
  col_month = input("", color.lime),
  size_month = input("Line size[plotshape]", 8, minval=1, maxval = 10, step=1)
header('Yearly Open')
const show_year = input("Yearly Open", false),
  col_year = input("", color.cyan),
  size_year = input("Line size[plotshape]", 10, minval=1, maxval = 10, step=1)

//
seq dow = dayofweek(time)
var prevdow = dow[1]
var newday = prevdow != dow,
  newweek = newday & (dayofweek(time) == 1),
  newmonth = newday & (dayofmonth(time) == 1),
  newyear = newday & (dayofyear(time) == 1)


seq day = open, week = open, month = open, year = open

day = newday ? open : day[1]
week = newweek ? open : week[1]
month = newmonth ? open : month[1]
year = newyear ? open : year[1]

//

//
seq 
  day_ = newday?na:day, 
  week_ = newweek?na:week,
  month_ = newmonth?na:month,
  year_ = newyear?na:year

plot(mode==1&show_day?day_:na, linewidth=1, color=col_day)
plot(mode==1&show_week?week_:na, linewidth=2, color=col_week)
plot(mode==1&show_month?month_:na, linewidth=3, color=col_month)
plot(mode==1&show_year?year_:na, linewidth=4, color=col_year)

plotshape(mode==2&show_day?day:na, shape.circle, size_day, color=col_day, autoscale=false)
plotshape(mode==2&show_week?week:na,  shape.circle, size_week, color=col_week, autoscale=false)
plotshape(mode==2&show_month?month:na, shape.circle, size_month, color=col_month, autoscale=false)
plotshape(mode==2&show_year?year:na, shape.circle, size_year, color=col_year, autoscale=false)