import math as mt

#Laskee kahden pisteen välisen etäisyyden
def etaisyys(coord1, coord2):
    R = 6371;# Radius of the earth in km
    dLat = deg2rad(coord2[0]-coord1[0])# deg2rad below
    dLon = deg2rad(coord2[1]-coord1[1])
    a = mt.sin(dLat/2) * mt.sin(dLat/2) + mt.cos(deg2rad(coord1[0])) * mt.cos(deg2rad(coord2[0])) * mt.sin(dLon/2) * mt.sin(dLon/2)
        
    c = 2 * mt.atan2(mt.sqrt(a), mt.sqrt(1-a));
    d = R * c; # Distance in km
    return d*1000

# Muuntaa asteet radiaaneiksi
def deg2rad(deg):
    return deg * (mt.pi/180)

# Poistaa paikkatiedot listan alusta ja lopusta parametrina tuodun pituuden matkalta 
def removeGpx(fit, m):
    route = 0
    i = 0
    while route < m:
      route += etaisyys([fit[i]['lat'],fit[i]['lon']], [fit[i+1]['lat'],fit[i+1]['lon']])
      del fit[i]['lat']
      del fit[i]['lon']
      i+=1

    route = 0
    i = len(fit)-1
    while route < m:
      route += etaisyys([fit[i]['lat'],fit[i]['lon']], [fit[i-1]['lat'],fit[i-1]['lon']])
      del fit[i]['lat']
      del fit[i]['lon']
      i-=1

    return fit