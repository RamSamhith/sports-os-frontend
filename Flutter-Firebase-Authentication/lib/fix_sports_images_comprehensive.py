import sys

with open(r'C:\Users\kmabd\myapp\lib\sports_provider.dart', 'r', encoding='utf-8') as f:
    content = f.read()

# Define the full comprehensive map
new_map = """final Map<String, String> _sportFallbackImages = {
  'archery': 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1000',
  'athletics': 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=1000',
  'badminton': 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=1000',
  'basketball': 'https://images.unsplash.com/photo-1519861531473-9200262188bf?q=80&w=1000',
  'boxing': 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?q=80&w=1000',
  'chess': 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?q=80&w=1000',
  'cricket': 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=1000',
  'cycling': 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1000',
  'football': 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1000',
  'gymnastics': 'https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?q=80&w=1000',
  'hockey': 'https://images.unsplash.com/photo-1580748141549-71748dbe0bdc?q=80&w=1000',
  'kabaddi': 'https://images.unsplash.com/photo-1628186178306-03716a5b6727?q=80&w=1000',
  'rugby': 'https://images.unsplash.com/photo-1519445837330-0eb537b03a74?q=80&w=1000',
  'shooting': 'https://images.unsplash.com/photo-1572949645841-094f3a9c4c94?q=80&w=1000',
  'skating': 'https://images.unsplash.com/photo-1564508933256-4c45a7bd7808?q=80&w=1000',
  'swimming': 'https://images.unsplash.com/photo-1519315901367-f34f81504cc6?q=80&w=1000',
  'table tennis': 'https://images.unsplash.com/photo-1611250282006-4484dd3fba6b?q=80&w=1000',
  'tennis': 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=1000',
  'volleyball': 'https://images.unsplash.com/photo-1593787406536-3696c6c19eef?q=80&w=1000',
  'wrestling': 'https://images.unsplash.com/photo-1509935102073-630e2f913d11?q=80&w=1000',
  'fitness': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000',
  'martial arts': 'https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=1000',
  'yoga': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000',
};"""

import re
# Replace the old _sportFallbackImages map definition with the new one
content = re.sub(
    r'final Map<String, String> _sportFallbackImages = \{.*?\};',
    new_map,
    content,
    flags=re.DOTALL
)

with open(r'C:\Users\kmabd\myapp\lib\sports_provider.dart', 'w', encoding='utf-8') as f:
    f.write(content)
print('Updated sports_provider.dart')
