import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'auth_provider.dart';
import 'theme.dart';
import 'colors.dart';
import 'sports_os_button.dart';
import 'glass_container.dart';

class ResetPasswordScreen extends ConsumerStatefulWidget {
  final String token;

  const ResetPasswordScreen({super.key, required this.token});

  @override
  ConsumerState<ResetPasswordScreen> createState() => _ResetPasswordScreenState();
}

class _ResetPasswordScreenState extends ConsumerState<ResetPasswordScreen> {
  final _formKey = GlobalKey<FormState>();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  bool _obscurePassword = true;
  bool _obscureConfirmPassword = true;
  bool _isLoading = false;
  String _successMessage = '';
  String? _errorMessage;

  @override
  void dispose() {
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  void _handleResetPassword() async {
    if (_formKey.currentState!.validate()) {
      setState(() {
        _isLoading = true;
        _errorMessage = null;
      });
      try {
        final message = await ref.read(authControllerProvider).confirmPasswordReset(
          widget.token,
          _passwordController.text,
        );
        if (mounted) {
          setState(() {
            _successMessage = message;
            _isLoading = false;
          });
        }
      } catch (e) {
        if (mounted) {
          setState(() {
            _errorMessage = e.toString().replaceAll('Exception: ', '');
            _isLoading = false;
          });
        }
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = ref.watch(themeProvider) == ThemeMode.dark;

    return Scaffold(
      backgroundColor: isDark ? AppColors.inkDark : AppColors.inkLight,
      body: Stack(
        children: [
          // Background Glows
          Positioned(
            top: -100,
            right: -50,
            child: Container(
              width: 300,
              height: 300,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: AppColors.green.withOpacity(isDark ? 0.1 : 0.05),
              ),
            )
            .animate(onPlay: (c) => c.repeat(reverse: true))
            .blurXY(end: 80)
            .scaleXY(end: 1.2, duration: 4.seconds),
          ),
          
          Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 24.0),
              child: GlassContainer(
                opacity: isDark ? 0.1 : 0.7,
                blur: 20,
                borderRadius: BorderRadius.circular(24),
                child: Container(
                  width: 400,
                  padding: const EdgeInsets.all(32.0),
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(
                      color: isDark ? Colors.white24 : Colors.black12,
                    ),
                  ),
                  child: _successMessage.isNotEmpty
                      ? _buildSuccessView(isDark)
                      : _buildFormView(isDark),
                ),
              ).animate().fadeIn().scale(begin: const Offset(0.9, 0.9)),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFormView(bool isDark) {
    return Form(
      key: _formKey,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppColors.green.withOpacity(0.1),
              shape: BoxShape.circle,
            ),
            child: const Icon(
              Icons.lock_reset,
              size: 48,
              color: AppColors.green,
            ),
          ),
          const SizedBox(height: 24),
          Text(
            'NEW PASSWORD',
            textAlign: TextAlign.center,
            style: GoogleFonts.barlowCondensed(
              fontSize: 28,
              fontWeight: FontWeight.bold,
              color: isDark ? Colors.white : Colors.black87,
              letterSpacing: 1.2,
            ),
          ),
          const SizedBox(height: 12),
          Text(
            'Enter your new password below.',
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 14,
              color: isDark ? AppColors.textSecondary : Colors.black54,
              height: 1.5,
            ),
          ),
          const SizedBox(height: 32),
          
          if (_errorMessage != null)
            Container(
              padding: const EdgeInsets.all(12),
              margin: const EdgeInsets.only(bottom: 24),
              decoration: BoxDecoration(
                color: Colors.red.withOpacity(0.1),
                border: Border.all(
                  color: Colors.red.withOpacity(0.3),
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

          GlassContainer(
            opacity: isDark ? 0.05 : 0.5,
            blur: 15,
            child: TextFormField(
              controller: _passwordController,
              obscureText: _obscurePassword,
              style: TextStyle(
                color: isDark ? AppColors.textPrimary : Colors.black87,
              ),
              decoration: InputDecoration(
                labelText: 'New Password',
                labelStyle: TextStyle(
                  color: isDark ? AppColors.textSecondary : Colors.black54,
                ),
                prefixIcon: Icon(
                  Icons.lock_outline,
                  color: isDark ? AppColors.textSecondary : Colors.black54,
                ),
                suffixIcon: IconButton(
                  icon: Icon(
                    _obscurePassword ? Icons.visibility_off : Icons.visibility,
                    color: isDark ? AppColors.textSecondary : Colors.black54,
                  ),
                  onPressed: () => setState(
                    () => _obscurePassword = !_obscurePassword,
                  ),
                ),
                border: InputBorder.none,
                contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
              ),
              validator: (value) {
                if (value == null || value.trim().isEmpty) {
                  return 'Please enter a password';
                }
                if (value.length < 8) {
                  return 'Password must be at least 8 characters';
                }
                return null;
              },
            ),
          ),
          const SizedBox(height: 20),

          GlassContainer(
            opacity: isDark ? 0.05 : 0.5,
            blur: 15,
            child: TextFormField(
              controller: _confirmPasswordController,
              obscureText: _obscureConfirmPassword,
              style: TextStyle(
                color: isDark ? AppColors.textPrimary : Colors.black87,
              ),
              decoration: InputDecoration(
                labelText: 'Confirm Password',
                labelStyle: TextStyle(
                  color: isDark ? AppColors.textSecondary : Colors.black54,
                ),
                prefixIcon: Icon(
                  Icons.lock_outline,
                  color: isDark ? AppColors.textSecondary : Colors.black54,
                ),
                suffixIcon: IconButton(
                  icon: Icon(
                    _obscureConfirmPassword ? Icons.visibility_off : Icons.visibility,
                    color: isDark ? AppColors.textSecondary : Colors.black54,
                  ),
                  onPressed: () => setState(
                    () => _obscureConfirmPassword = !_obscureConfirmPassword,
                  ),
                ),
                border: InputBorder.none,
                contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
              ),
              validator: (value) {
                if (value == null || value.trim().isEmpty) {
                  return 'Please confirm your password';
                }
                if (value != _passwordController.text) {
                  return 'Passwords do not match';
                }
                return null;
              },
            ),
          ),
          
          const SizedBox(height: 32),
          _isLoading 
            ? const Center(child: CircularProgressIndicator(color: AppColors.green))
            : SportsOSButton(
              text: 'Reset Password',
              onPressed: _handleResetPassword,
            ),
          
          const SizedBox(height: 16),
          TextButton(
            onPressed: () => context.go('/signin'),
            child: const Text('Back to Sign In'),
          ),
        ],
      ),
    );
  }

  Widget _buildSuccessView(bool isDark) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.green.withOpacity(0.1),
            shape: BoxShape.circle,
          ),
          child: const Icon(
            Icons.check_circle_outline,
            size: 64,
            color: Colors.green,
          ),
        ).animate().scale().fadeIn(),
        const SizedBox(height: 24),
        Text(
          'SUCCESS',
          textAlign: TextAlign.center,
          style: GoogleFonts.barlowCondensed(
            fontSize: 32,
            fontWeight: FontWeight.bold,
            color: isDark ? Colors.white : Colors.black87,
            letterSpacing: 1.2,
          ),
        ),
        const SizedBox(height: 16),
        Text(
          _successMessage,
          textAlign: TextAlign.center,
          style: TextStyle(
            fontSize: 14,
            color: isDark ? AppColors.textSecondary : Colors.black54,
            height: 1.5,
          ),
        ),
        const SizedBox(height: 32),
        SportsOSButton(
          text: 'Go to Sign In',
          onPressed: () {
            context.go('/signin');
          },
        ),
      ],
    );
  }
}
