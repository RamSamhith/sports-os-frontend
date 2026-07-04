import re

files = [
    'lib/parent_registration_screen.dart',
    'lib/student_registration_screen.dart',
    'lib/coach_registration_screen.dart'
]

for file_path in files:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    if 'extendBodyBehindAppBar: true,' not in content:
        # 1. Update Scaffold Start
        old_scaffold_regex = r"    return Scaffold\(\n      appBar: AppBar\(\n        backgroundColor: Colors\.transparent,\n        elevation: 0,\n        leading: IconButton\(\n          icon: Icon\(\n            Icons\.arrow_back_ios_new,\n            color: isDark \? AppColors\.textPrimary : AppColors\.textLight,\n            size: 20,\n          \),\n          onPressed: \(\) => context\.go\('/role-select'\),\n        \),\n      \),\n      body: SafeArea\("
        
        new_scaffold = '''    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: Icon(
            Icons.arrow_back_ios_new,
            color: isDark ? AppColors.textPrimary : AppColors.textLight,
            size: 20,
          ),
          onPressed: () => context.go('/role-select'),
        ),
      ),
      body: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: BoxDecoration(
          gradient: isDark ? AppColors.darkGradient : AppColors.lightGradient,
        ),
        child: SafeArea('''
        
        content = re.sub(old_scaffold_regex, new_scaffold, content, flags=re.DOTALL)
        
        # 2. Update Scaffold End
        old_end = '''    );
  }
}'''
        new_end = '''      ),
    );
  }
}'''
        content = content.replace(old_end, new_end)

        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
            
print("Done patching registration screens")
