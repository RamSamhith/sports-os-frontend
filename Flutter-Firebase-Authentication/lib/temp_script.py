with open(r'C:\Users\kmabd\myapp\lib\sign_in_screen.dart', 'r', encoding='utf-8') as f:
    content = f.read()

func = '''
  void _routeBasedOnRole() {
    final userState = ref.read(authStateProvider);
    final role = userState.value?.role;
    if (role == 'coach') {
      context.go('/coach_dashboard');
    } else if (role == 'academy') {
      context.go('/academy_dashboard');
    } else {
      context.go('/home');
    }
  }
'''

content = content.replace('  @override\n  void dispose() {', func + '\n  @override\n  void dispose() {')
content = content.replace("if (mounted) context.go('/home');", "if (mounted) _routeBasedOnRole();")
content = content.replace("context.go('/home');", "_routeBasedOnRole();")

with open(r'C:\Users\kmabd\myapp\lib\sign_in_screen.dart', 'w', encoding='utf-8') as f:
    f.write(content)
print('Updated sign_in_screen.dart')
