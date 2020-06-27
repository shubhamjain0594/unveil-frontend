"""Draw svg."""
import drawSvg as draw
import math

radius = -200
size = -2 * radius + 50
d = draw.Drawing(size, size, origin='center')
for theta in range(36, 360-36, 18):
    print(theta)
    print(radius*math.sin(math.radians(theta)), radius*math.cos(math.radians(theta)),
          radius*math.sin(math.radians(theta+18)), radius*math.cos(math.radians(theta+18)))
    d.append(draw.Lines(radius*math.sin(math.radians(theta)), radius*math.cos(math.radians(theta)),
                        radius*math.sin(math.radians(theta+18)), radius*math.cos(math.radians(theta+18)),
                        stroke_width=5,
                        stroke='white'))

d.setPixelScale(2)  # Set number of pixels per geometry unit
d.savePng('example.png')
