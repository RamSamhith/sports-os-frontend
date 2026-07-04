import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'theme.dart';
import 'colors.dart';
import 'sports_os_button.dart';

class SignInScreen extends ConsumerWidget {
  const SignInScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isDark = ref.watch(themeProvider) == ThemeMode.dark;

    return Scaffold(
      appBar: AppBar(
        title: Text(
          'SIGN IN',
          style: GoogleFonts.barlowCondensed(
            fontWeight: FontWeight.w700,
            color: isDark ? AppColors.textPrimary : AppColors.textLight,
          ),
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: Icon(
            Icons.arrow_back_ios_new,
            color: isDark ? AppColors.textPrimary : AppColors.textLight,
            size: 20,
          ),
          onPressed: () => context.pop(),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Welcome Back',
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: isDark ? AppColors.textPrimary : AppColors.textLight,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'Sign in to continue to Sports OS.',
                style: TextStyle(
                  fontSize: 16,
                  color: isDark ? AppColors.textSecondary : Colors.black87,
                ),
              ),
              const SizedBox(height: 32),
              _buildTextField(
                'Email Address',
                isDark,
                keyboardType: TextInputType.emailAddress,
              ),
              const SizedBox(height: 16),
              _buildTextField('Password', isDark, obscureText: true),
              const SizedBox(height: 32),
              SportsOSButton(
                text: 'Sign In',
                onPressed: () {
                  // TODO: Handle Sign In logic here
                },
              ),
              const SizedBox(height: 16),
              Center(
                child: TextButton.icon(
                  onPressed: () => context.go('/home'),
                  icon: const Icon(Icons.explore),
                  label: const Text('Explore the app as a guest'),
                  style: TextButton.styleFrom(
                    foregroundColor:
                        isDark ? AppColors.textSecondary : Colors.black54,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTextField(
    String label,
    bool isDark, {
    bool obscureText = false,
    TextInputType? keyboardType,
  }) {
    return TextField(
      obscureText: obscureText,
      keyboardType: keyboardType,
      style: TextStyle(color: isDark ? AppColors.textPrimary : Colors.black),
      decoration: InputDecoration(
        labelText: label,
        labelStyle: TextStyle(
          color: isDark ? AppColors.textSecondary : Colors.black54,
        ),
        enabledBorder: OutlineInputBorder(
          borderSide: BorderSide(
            color: isDark
                ? AppColors.textSecondary.withValues(alpha: 0.3)
                : Colors.black26,
          ),
          borderRadius: BorderRadius.circular(12),
        ),
        focusedBorder: OutlineInputBorder(
          borderSide: const BorderSide(color: AppColors.green),
          borderRadius: BorderRadius.circular(12),
        ),
        filled: true,
        fillColor: isDark ? AppColors.cardDark : Colors.white,
      ),
    );
  }
}
