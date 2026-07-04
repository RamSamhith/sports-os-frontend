import sys
import re

with open(r'C:\Users\kmabd\myapp\lib\academy_provider.dart', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('final String? instagram;', 'final String? instagram;\n  final String? website;')
content = content.replace('this.instagram,', 'this.instagram,\n    this.website,')
content = content.replace('instagram: instagram', 'instagram: instagram, website: website')

content = re.sub(r"      facilities: \['Air Conditioned', 'Pro Shop', 'Water Cooler'\],\n", "", content)
content = re.sub(r"      facilities: \['Meditation Room', 'Training Floor', 'Air Conditioned'\],\n", "", content)
content = re.sub(r"      facilities: \['Weight Area', 'Juice Bar', 'Free Wifi'\],\n", "", content)

with open(r'C:\Users\kmabd\myapp\lib\academy_provider.dart', 'w', encoding='utf-8') as f:
    f.write(content)
print('Updated academy_provider.dart')
