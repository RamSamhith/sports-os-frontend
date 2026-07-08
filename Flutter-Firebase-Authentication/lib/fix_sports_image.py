import sys
with open(r'C:\Users\kmabd\myapp\lib\sports_provider.dart', 'r', encoding='utf-8') as f:
    content = f.read()

fallback_logic = """
final Map<String, String> _sportFallbackImages = {
  'cricket': 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=1000',
  'football': 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1000',
  'badminton': 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=1000',
  'fitness': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000',
  'martial arts': 'https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=1000',
  'archery': 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1000',
  'athletics': 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=1000',
  'basketball': 'https://images.unsplash.com/photo-1519861531473-9200262188bf?q=80&w=1000',
  'boxing': 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?q=80&w=1000',
  'chess': 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?q=80&w=1000',
  'yoga': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000',
};

String getFallbackImage(String name) {
  final key = name.toLowerCase().trim();
  return _sportFallbackImages[key] ?? 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=1000';
}

class SportsNotifier extends StateNotifier<List<Sport>> {
"""

content = content.replace("class SportsNotifier extends StateNotifier<List<Sport>> {", fallback_logic)
content = content.replace("heroImage: json['imageUrl'] ?? 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=1000',", "heroImage: json['imageUrl'] ?? getFallbackImage(json['name'] ?? ''),")

with open(r'C:\Users\kmabd\myapp\lib\sports_provider.dart', 'w', encoding='utf-8') as f:
    f.write(content)
print('Updated sports_provider.dart')
