import re

with open('lib/sign_in_screen.dart', 'r', encoding='utf-8') as f:
    content = f.read()

# Add imports if missing
if 'import ''social_login_button.dart'';' not in content:
    content = content.replace('import ''sports_os_button.dart'';', 'import ''sports_os_button.dart'';\nimport ''forgot_password_dialog.dart'';\nimport ''social_login_button.dart'';')

# Add extendBodyBehindAppBar and background gradient
if 'extendBodyBehindAppBar: true,' not in content:
    old_scaffold = '''    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: Icon(
            Icons.arrow_back_ios_new,
            color: isDark ? AppColors.textPrimary : AppColors.textLight,
            size: 20,
          ),
          onPressed: () => context.go('/welcome'),
        ),
      ),
      body: SafeArea('''
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
          onPressed: () => context.go('/welcome'),
        ),
      ),
      body: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: BoxDecoration(
          gradient: isDark ? AppColors.darkGradient : AppColors.lightGradient,
        ),
        child: SafeArea('''
    content = content.replace(old_scaffold, new_scaffold)

# Add forgot password popup
old_forgot = '''                      // TODO: Implement forgot password
                    },
                    child: const Text('Forgot Password?'),'''
new_forgot = '''                      showDialog(
                        context: context,
                        barrierColor: Colors.black54,
                        builder: (context) => const ForgotPasswordDialog(),
                      );
                    },
                    child: const Text('Forgot Password?'),'''
content = content.replace(old_forgot, new_forgot)

# Fix Sign In auth logic
old_signin = '''                  onPressed: () {
                    // Reset error message on new attempt
                    setState(() => _errorMessage = null);

                    if (_formKey.currentState!.validate()) {
                      // Simulate error for demonstration if input is 'error'
                      if (_emailController.text.trim().toLowerCase() ==
                          'error') {
                        setState(() {
                          _errorMessage =
                              'Invalid credentials. Please try again.';
                        });
                      } else {
                        // TODO: Add backend authentication logic here
                        // Pass the selected role to the home screen if needed
                        context.go('/home');
                      }
                    }
                  },'''
new_signin = '''                  onPressed: () async {
                    // Reset error message on new attempt
                    setState(() => _errorMessage = null);

                    if (_formKey.currentState!.validate()) {
                      try {
                        await ref.read(authControllerProvider).loginWithEmail(
                          _emailController.text.trim(),
                          _passwordController.text,
                        );
                        if (mounted) context.go('/home');
                      } catch (e) {
                        if (mounted) {
                          setState(() {
                            _errorMessage = 'Invalid credentials. Please try again.';
                          });
                        }
                      }
                    }
                  },'''
content = content.replace(old_signin, new_signin)

# Replace social buttons
social_regex = r"                // Social Buttons\n                Row\(\n                  mainAxisAlignment: MainAxisAlignment\.center,\n                  children: \[\n.*?\n                  \],\n                \)\.animate\(\)\.fadeIn\(delay: 800\.ms\),"
new_social = '''                // Social Buttons
                Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    SocialLoginButton(
                      type: SocialType.google,
                      onPressed: () async {
                        try {
                          await ref.read(authControllerProvider).loginWithGoogle();
                          if (mounted) context.go('/home');
                        } catch (e) {
                          if (mounted) {
                            setState(() {
                              _errorMessage = 'Google Sign-In failed.';
                            });
                          }
                        }
                      },
                    ),
                    const SizedBox(height: 16),
                    SocialLoginButton(
                      type: SocialType.microsoft,
                      onPressed: () async {
                        try {
                          await ref.read(authControllerProvider).loginWithMicrosoft();
                          if (mounted) context.go('/home');
                        } catch (e) {
                          if (mounted) {
                            setState(() {
                              _errorMessage = 'Microsoft Sign-In failed.';
                            });
                          }
                        }
                      },
                    ),
                  ],
                ).animate().fadeIn(delay: 850.ms),'''
content = re.sub(social_regex, new_social, content, flags=re.DOTALL)

with open('lib/sign_in_screen.dart', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
