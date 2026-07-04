import glob
import re

files_to_update = [
    r'C:\Users\kmabd\myapp\lib\sign_in_screen.dart',
    r'C:\Users\kmabd\myapp\lib\coach_registration_screen.dart',
    r'C:\Users\kmabd\myapp\lib\parent_registration_screen.dart',
    r'C:\Users\kmabd\myapp\lib\student_registration_screen.dart',
    r'C:\Users\kmabd\myapp\lib\otp_signin_screen.dart',
]

for file_path in files_to_update:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    if "import 'route_utils.dart';" not in content:
        content = content.replace("import 'package:flutter/material.dart';", "import 'package:flutter/material.dart';\nimport 'route_utils.dart';")

    if 'sign_in_screen' in file_path:
        # Remove the previously injected _routeBasedOnRole function
        func_regex = re.compile(r'\s*void _routeBasedOnRole\(\) \{.*?\n\s*\}\n', re.DOTALL)
        content = func_regex.sub('\n', content)
        content = content.replace('_routeBasedOnRole();', 'routeBasedOnRole(context, ref);')

    else:
        # Replace context.go('/home') in registration screens that happens after login/signup
        content = content.replace("if (mounted) context.go('/home');", "if (mounted) routeBasedOnRole(context, ref);")
        # Find occurrences where context.go('/home') is used inside an onPressed or then block for auth
        # It's safer to just replace them carefully or broadly because we want after-signup to go to correct dashboard
        # Let's replace `context.go('/home');` inside the `register` success block
        # Specifically:
        content = content.replace("          context.go('/home');", "          routeBasedOnRole(context, ref);")
        # for otp signin:
        content = content.replace("        if (mounted) context.go('/home');", "        if (mounted) routeBasedOnRole(context, ref);")

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'Updated {file_path}')

