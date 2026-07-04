import sys
with open(r'C:\Users\kmabd\myapp\lib\academy_provider.dart', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('final String? gender;', 'final String? gender;\n  final List<String> ageGroups;\n  final double? latitude;\n  final double? longitude;')
content = content.replace('this.gender,', 'this.gender,\n    this.ageGroups = const [],\n    this.latitude,\n    this.longitude,')
content = content.replace('gender: gender', 'gender: gender, ageGroups: ageGroups, latitude: latitude, longitude: longitude')

content = content.replace("      facilities: ['Self Defense', 'Karate', 'Meditation Classes'],\n", "")
content = content.replace("      facilities: ['Karate', 'Weight Loss', 'Mixed Martial Arts (MMA)'],\n", "")

with open(r'C:\Users\kmabd\myapp\lib\academy_provider.dart', 'w', encoding='utf-8') as f:
    f.write(content)
print('Updated academy_provider.dart')
