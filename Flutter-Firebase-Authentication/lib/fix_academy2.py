import sys
import re

with open(r'C:\Users\kmabd\myapp\lib\academy_provider.dart', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('final double? longitude;', 'final double? longitude;\n  final String? facebook;\n  final String? instagram;')
content = content.replace('this.longitude,', 'this.longitude,\n    this.facebook,\n    this.instagram,')
content = content.replace('longitude: longitude', 'longitude: longitude, facebook: facebook, instagram: instagram')

content = re.sub(r"      facilities: \['Weightlifting', 'Cardio', 'Personal Training'\],\n", "", content)
content = re.sub(r"      facilities: \['Squash Courts', 'Showers', 'Equipment Shop'\],\n", "", content)
content = re.sub(r"      facilities: \['Main Dojo', 'Weights Area', 'Changing Rooms'\],\n", "", content)
content = re.sub(r"      facilities: \['Mat Area', 'Equipment Room', 'Locker Room'\],\n", "", content)
content = re.sub(r"      facilities: \['Badminton Courts', 'Restrooms', 'Cafeteria'\],\n", "", content)
content = re.sub(r"      facilities: \['Swimming Pool', 'Changing Rooms', 'Showers'\],\n", "", content)

with open(r'C:\Users\kmabd\myapp\lib\academy_provider.dart', 'w', encoding='utf-8') as f:
    f.write(content)
print('Updated academy_provider.dart')
