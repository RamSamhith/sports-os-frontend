import 'package:flutter/material.dart';
import 'route_utils.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'colors.dart';
import 'theme.dart';
import 'sports_os_button.dart';
import 'forgot_password_dialog.dart';
import 'social_login_button.dart';
import 'auth_provider.dart';

class SignInScreen extends ConsumerStatefulWidget {
  const SignInScreen({super.key});

  @override
  ConsumerState<SignInScreen> createState() => _SignInScreenState();
}

class _SignInScreenState extends ConsumerState<SignInScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _obscurePassword = true;
  String _selectedRole = 'Student';
  String? _errorMessage;
  final List<String> _roles = const ['Parent', 'Student', 'Coach'];

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = ref.watch(themeProvider) == ThemeMode.dark;

    return Scaffold(
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
        child: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24.0),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 10),
                Text(
                  'WELCOME\nBACK',
                  style: GoogleFonts.barlowCondensed(
                    fontSize: 56,
                    fontWeight: FontWeight.w900,
                    height: 1.0,
                    color: isDark ? AppColors.textPrimary : AppColors.textLight,
                  ),
                ).animate().fadeIn(duration: 500.ms).slideX(begin: -0.2),
                const SizedBox(height: 12),
                Text(
                  'Sign in to continue your sports journey.',
                  style: TextStyle(
                    fontSize: 16,
                    color: isDark ? AppColors.textSecondary : Colors.black87,
                    height: 1.5,
                  ),
                ).animate().fadeIn(delay: 200.ms),
                const SizedBox(height: 32),

                // Error Message Banner
                if (_errorMessage != null)
                  Container(
                    padding: const EdgeInsets.all(12),
                    margin: const EdgeInsets.only(bottom: 24),
                    decoration: BoxDecoration(
                      color: Colors.red.withValues(alpha: 0.1),
                      border: Border.all(
                        color: Colors.red.withValues(alpha: 0.3),
                      ),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Row(
                      children: [
                        const Icon(
                          Icons.error_outline,
                          color: Colors.red,
                          size: 20,
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Text(
                            _errorMessage!,
                            style: const TextStyle(color: Colors.red),
                          ),
                        ),
                      ],
                    ),
                  ).animate().fadeIn().slideY(begin: -0.1),

                // Role Selection Chips
                Text(
                  'I am a:',
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: isDark ? AppColors.textSecondary : Colors.black87,
                  ),
                ).animate().fadeIn(delay: 300.ms),
                const SizedBox(height: 12),
                Row(
                  children: _roles.map((role) {
                    final isSelected = _selectedRole == role;
                    return Expanded(
                      child: Padding(
                        padding: EdgeInsets.only(
                          right: role != _roles.last ? 8.0 : 0,
                        ),
                        child: GestureDetector(
                          onTap: () => setState(() => _selectedRole = role),
                          child: AnimatedContainer(
                            duration: const Duration(milliseconds: 200),
                            padding: const EdgeInsets.symmetric(vertical: 12),
                            alignment: Alignment.center,
                            decoration: BoxDecoration(
                              color: isSelected
                                  ? AppColors.green.withValues(alpha: 0.15)
                                  : Colors.transparent,
                              border: Border.all(
                                color: isSelected
                                    ? AppColors.green
                                    : (isDark
                                        ? Colors.white24
                                        : Colors.black12),
                              ),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Text(
                              role,
                              style: TextStyle(
                                color: isSelected
                                    ? AppColors.green
                                    : (isDark
                                        ? AppColors.textSecondary
                                        : Colors.black87),
                                fontWeight: isSelected
                                    ? FontWeight.bold
                                    : FontWeight.normal,
                                fontSize: 13,
                              ),
                            ),
                          ),
                        ),
                      ),
                    );
                  }).toList(),
                ).animate().fadeIn(delay: 350.ms).slideY(begin: 0.1),
                const SizedBox(height: 24),

                // Email Field
                TextFormField(
                  controller: _emailController,
                  style: TextStyle(
                    color: isDark ? AppColors.textPrimary : Colors.black87,
                  ),
                  decoration: InputDecoration(
                    labelText: 'Email or Phone Number',
                    prefixIcon: const Icon(Icons.person_outline),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter your email or phone number';
                    }
                    return null;
                  },
                ).animate().fadeIn(delay: 400.ms).slideY(begin: 0.1),

                const SizedBox(height: 20),

                // Password Field
                TextFormField(
                  controller: _passwordController,
                  obscureText: _obscurePassword,
                  style: TextStyle(
                    color: isDark ? AppColors.textPrimary : Colors.black87,
                  ),
                  decoration: InputDecoration(
                    labelText: 'Password',
                    prefixIcon: const Icon(Icons.lock_outline),
                    suffixIcon: IconButton(
                      icon: Icon(
                        _obscurePassword
                            ? Icons.visibility_off
                            : Icons.visibility,
                      ),
                      onPressed: () {
                        setState(() {
                          _obscurePassword = !_obscurePassword;
                        });
                      },
                    ),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter your password';
                    }
                    return null;
                  },
                ).animate().fadeIn(delay: 500.ms).slideY(begin: 0.1),

                const SizedBox(height: 12),

                // Forgot Password
                Align(
                  alignment: Alignment.centerRight,
                  child: TextButton(
                    onPressed: () {
                      showDialog(
                        context: context,
                        barrierColor: Colors.black54,
                        builder: (context) => const ForgotPasswordDialog(),
                      );
                    },
                    child: const Text('Forgot Password?'),
                  ),
                ).animate().fadeIn(delay: 600.ms),

                const SizedBox(height: 32),

                // Sign In Button
                SportsOSButton(
                  text: 'Sign In',
                  onPressed: () async {
                    // Reset error message on new attempt
                    setState(() => _errorMessage = null);

                    if (_formKey.currentState!.validate()) {
                      try {
                        await ref.read(authControllerProvider).loginWithEmail(
                          _emailController.text.trim(),
                          _passwordController.text,
                        );
                        if (mounted) routeBasedOnRole(context, ref);
                      } catch (e) {
                        if (mounted) {
                          setState(() {
                            _errorMessage = 'Invalid credentials. Please try again.';
                          });
                        }
                      }
                    }
                  },
                ).animate().fadeIn(delay: 700.ms),

                const SizedBox(height: 24),

                // OR Divider
                Row(
                  children: [
                    Expanded(
                      child: Divider(
                        color: isDark ? Colors.white24 : Colors.black12,
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      child: Text(
                        'OR CONTINUE WITH',
                        style: TextStyle(
                          color:
                              isDark ? AppColors.textSecondary : Colors.black54,
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    Expanded(
                      child: Divider(
                        color: isDark ? Colors.white24 : Colors.black12,
                      ),
                    ),
                  ],
                ).animate().fadeIn(delay: 750.ms),

                  const SizedBox(height: 24),

                  // Social Login Buttons
                  SocialLoginButton(
                    type: SocialType.google,
                    onPressed: () async {
                      try {
                        await ref.read(authControllerProvider).loginWithGoogle();
                        if (mounted) routeBasedOnRole(context, ref);
                      } catch (e) {
                        if (mounted) {
                          setState(() => _errorMessage = 'Google: ${e.toString()}');
                        }
                      }
                    },
                  ).animate().fadeIn(delay: 800.ms),

                  const SizedBox(height: 32),

                  // Register redirect
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      'Don\'t have an account?',
                      style: TextStyle(
                        color:
                            isDark ? AppColors.textSecondary : Colors.black54,
                      ),
                    ),
                    TextButton(
                      onPressed: () => context.go('/role'),
                      child: const Text('Sign Up'),
                    ),
                  ],
                ).animate().fadeIn(delay: 850.ms),

                const SizedBox(height: 16),

                // Explore App (Guest) Button
                Center(
                  child: TextButton.icon(
                    onPressed: () {
                      // Navigates directly to home for exploring without info
                      routeBasedOnRole(context, ref);
                    },
                    icon: const Icon(Icons.explore),
                    label: const Text('Explore without signing in'),
                    style: TextButton.styleFrom(
                      foregroundColor:
                          isDark ? AppColors.textSecondary : Colors.black54,
                    ),
                  ),
                ).animate().fadeIn(delay: 900.ms),
              ],
            ),
          ),
        ),
      ),
      ),
    );
  }
}
