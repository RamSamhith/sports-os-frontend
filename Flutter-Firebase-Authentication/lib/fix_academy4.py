import sys
import re

with open(r'C:\Users\kmabd\myapp\lib\academy_provider.dart', 'r', encoding='utf-8') as f:
    content = f.read()

# Make facilities non-nullable
content = content.replace('final List<String>? facilities;', 'final List<String> facilities;')
content = content.replace('this.facilities,', 'this.facilities = const [],')

# Remove duplicate facilities
content = re.sub(r"      facilities: \['Parking', 'Restrooms', 'Cafeteria', 'Video Analysis Room', 'Equipment Shop'\],\n", "", content)
content = re.sub(r"      facilities: \['Floodlights', 'Locker Rooms', 'Showers', 'First Aid Center'\],\n", "", content)
content = re.sub(r"      facilities: \['Sauna', 'Protein Bar', 'Personal Lockers'\],\n", "", content)

with open(r'C:\Users\kmabd\myapp\lib\academy_provider.dart', 'w', encoding='utf-8') as f:
    f.write(content)

with open(r'C:\Users\kmabd\myapp\lib\academy_details_screen.dart', 'r', encoding='utf-8') as f:
    content2 = f.read()
content2 = content2.replace('academy.facilities.map', '(academy.facilities).map')
with open(r'C:\Users\kmabd\myapp\lib\academy_details_screen.dart', 'w', encoding='utf-8') as f:
    f.write(content2)

print('Updated files')
