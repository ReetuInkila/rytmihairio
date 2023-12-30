import math
from server.utilities import etaisyys, deg2rad

def test_etaisyys():
    # Test distance calculation between two points
    coord1 = (0, 0)
    coord2 = (0, 1)
    distance = etaisyys(coord1, coord2)
    assert math.isclose(distance, 111195.1, rel_tol=1e-1)  # Approximate distance between (0, 0) and (0, 1)

def test_deg2rad():
    # Test degree to radian conversion
    deg = 180
    rad = deg2rad(deg)
    assert math.isclose(rad, math.pi, rel_tol=1e-5)
