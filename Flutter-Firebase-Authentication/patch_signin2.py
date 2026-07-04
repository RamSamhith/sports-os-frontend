import re

with open('lib/sign_in_screen.dart', 'r', encoding='utf-8') as f:
    content = f.read()

# I need to add an extra ')' at the end of the Scaffold's body.
old_end = '''    );
  }
}'''
new_end = '''      ),
    );
  }
}'''
content = content.replace(old_end, new_end)

with open('lib/sign_in_screen.dart', 'w', encoding='utf-8') as f:
    f.write(content)
