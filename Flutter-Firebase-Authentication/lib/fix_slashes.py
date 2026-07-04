import sys
with open(r'C:\Users\kmabd\myapp\lib\academy_provider.dart', 'r', encoding='utf-8') as f:
    content = f.read()

fixed = content.replace("\\'", "'")

with open(r'C:\Users\kmabd\myapp\lib\academy_provider.dart', 'w', encoding='utf-8') as f:
    f.write(fixed)
print('Fixed backslashes in academy_provider.dart')
