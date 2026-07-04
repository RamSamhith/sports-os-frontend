import sys

with open(r'C:\Users\kmabd\myapp\lib\academy_details_screen.dart', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('academy.features', 'academy.facilities')
content = content.replace('Text(academy.gender),', "Text(academy.gender ?? 'Unspecified'),")
content = content.replace('academy.aboutText,', "academy.aboutText ?? '',")

with open(r'C:\Users\kmabd\myapp\lib\academy_details_screen.dart', 'w', encoding='utf-8') as f:
    f.write(content)

with open(r'C:\Users\kmabd\myapp\lib\academy_provider.dart', 'r', encoding='utf-8') as f:
    content2 = f.read()

content2 = content2.replace(\"facilities: json['facilities'] != null ? List<String>.from(json['facilities']) : null,\", \"facilities: json['facilities'] != null ? List<String>.from(json['facilities']) : [],\")

with open(r'C:\Users\kmabd\myapp\lib\academy_provider.dart', 'w', encoding='utf-8') as f:
    f.write(content2)

print('Updated files')
