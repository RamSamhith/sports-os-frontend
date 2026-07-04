import re

with open('lib/sign_in_screen.dart', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix missing imports
if 'import \"forgot_password_dialog.dart\";' not in content and \"import 'forgot_password_dialog.dart';\" not in content:
    content = content.replace(\"import 'sports_os_button.dart';\", \"import 'sports_os_button.dart';\\nimport 'forgot_password_dialog.dart';\\nimport 'social_login_button.dart';\")

with open('lib/sign_in_screen.dart', 'w', encoding='utf-8') as f:
    f.write(content)

# Fix trailing syntax in registration screens
files = [
    'lib/parent_registration_screen.dart',
    'lib/student_registration_screen.dart',
    'lib/coach_registration_screen.dart'
]

for file_path in files:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # The bad end looks like:
    #      ),
    #       ),
    #     );
    #   }
    # }
    
    bad_end = '''      ),
      ),
    );
  }
}'''
    good_end = '''      ),
    );
  }
}'''
    
    if bad_end in content:
        content = content.replace(bad_end, good_end)
    
    # Another possibility from my script:
    bad_end2 = '''      ),
       ),
    );
  }
}'''
    if bad_end2 in content:
         content = content.replace(bad_end2, good_end)
         
    # Let's just fix the end of file manually
    content = re.sub(r\"      \),\n      \),\n    \);\n  \}\n\}\", r\"      \),\n    \);\n  \}\n\}\", content)
    content = re.sub(r\"      \),\n       \),\n    \);\n  \}\n\}\", r\"      \),\n    \);\n  \}\n\}\", content)
    
    # The actual bad end in student_registration_screen was:
    #       ),
    #       ),
    #     );
    #   }
    # }
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

print(\"Fixed syntax\")
