import 'package:flutter/material.dart';
import 'auth_provider.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:google_fonts/google_fonts.dart';
import 'theme.dart';
import 'colors.dart';
import 'sports_os_button.dart';
import 'glass_container.dart';

class ForgotPasswordScreen extends ConsumerStatefulWidget {
  const ForgotPasswordScreen({super.key});

  @override
  ConsumerState<ForgotPasswordScreen> createState() => _ForgotPasswordScreenState();
}

class _ForgotPasswordScreenState extends ConsumerState<ForgotPasswordScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  bool _isSubmitted = false;
  bool _isLoading = false;
  String _successMessage = '';

  @override
  void dispose() {
    _emailController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = ref.watch(themeProvider) == ThemeMode.dark;

    return Scaffold(
      backgroundColor: isDark ? AppColors.inkDark : AppColors.inkLight,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back, color: isDark ? Colors.white : Colors.black87),
          onPressed: () => context.pop(),
        ),
      ),
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24.0),
            child: Container(
              constraints: const BoxConstraints(maxWidth: 400),
              child: _isSubmitted ? _buildSuccessView(isDark) : _buildFormView(isDark),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildFormView(bool isDark) {
    return Form(
      key: _formKey,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Icon/Logo
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppColors.green.withValues(alpha: 0.1),
              shape: BoxShape.circle,
            ),
            child: const Icon(
              Icons.lock_reset,
              size: 64,
              color: AppColors.green,
            ),
          ).animate().scale().fadeIn(),
          const SizedBox(height: 32),

          // Title
          Text(
            'FORGOT PASSWORD?',
            textAlign: TextAlign.center,
            style: GoogleFonts.barlowCondensed(
              fontSize: 32,
              fontWeight: FontWeight.bold,
              color: isDark ? Colors.white : Colors.black87,
              letterSpacing: 1.2,
            ),
          ).animate().fadeIn(delay: 100.ms).slideY(begin: 0.1),
          const SizedBox(height: 16),

          // Subtitle
          Text(
            'Enter your registered email address or phone number, and we\'ll send you instructions to reset your password.',
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 14,
              color: isDark ? AppColors.textSecondary : Colors.black54,
              height: 1.5,
            ),
          ).animate().fadeIn(delay: 200.ms).slideY(begin: 0.1),
          const SizedBox(height: 32),

          // Email Field
          GlassContainer(
            opacity: isDark ? 0.05 : 0.5,
            blur: 15,
            child: TextFormField(
              controller: _emailController,
              style: TextStyle(
                color: isDark ? AppColors.textPrimary : Colors.black87,
              ),
              decoration: InputDecoration(
                labelText: 'Email or Phone Number',
                labelStyle: TextStyle(
                  color: isDark ? AppColors.textSecondary : Colors.black54,
                ),
                prefixIcon: Icon(
                  Icons.email_outlined,
                  color: isDark ? AppColors.textSecondary : Colors.black54,
                ),
                border: InputBorder.none,
                contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
              ),
              validator: (value) {
                if (value == null || value.trim().isEmpty) {
                  return 'Please enter your email or phone';
                }
                return null;
              },
            ),
          ).animate().fadeIn(delay: 300.ms).slideY(begin: 0.1),

          const SizedBox(height: 32),

          // Submit Button
          SportsOSButton(
            text: 'Send Reset Link',
            onPressed: () async {
              if (_formKey.currentState!.validate()) {
                try {
                  final message = await ref.read(authControllerProvider).resetPassword(
                    _emailController.text.trim(),
                  );
                  if (mounted) {
                    setState(() {
                      _successMessage = message;
                      _isSubmitted = true;
                      _isLoading = false;
                    });
                  }
                } catch (e) {
                  if (mounted) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Failed to send reset link')),
                    );
                  }
                }
              }
            },
          ).animate().fadeIn(delay: 400.ms),
        ],
      ),
    );
  }

  Widget _buildSuccessView(bool isDark) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        // Success Icon
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.green.withValues(alpha: 0.1),
            shape: BoxShape.circle,
          ),
          child: const Icon(
            Icons.check_circle_outline,
            size: 64,
            color: Colors.green,
          ),
        ).animate().scale().fadeIn(),
        const SizedBox(height: 32),

        // Title
        Text(
          'SUCCESS',
          textAlign: TextAlign.center,
          style: GoogleFonts.barlowCondensed(
            fontSize: 32,
            fontWeight: FontWeight.bold,
            color: isDark ? Colors.white : Colors.black87,
            letterSpacing: 1.2,
          ),
        ).animate().fadeIn(delay: 100.ms).slideY(begin: 0.1),
        const SizedBox(height: 16),

        // Subtitle
        Text(
          _successMessage.isNotEmpty 
              ? _successMessage 
              : 'password sent to your email successfully\n${_emailController.text}',
          textAlign: TextAlign.center,
          style: TextStyle(
            fontSize: 14,
            color: isDark ? AppColors.textSecondary : Colors.black54,
            height: 1.5,
          ),
        ).animate().fadeIn(delay: 200.ms).slideY(begin: 0.1),
        const SizedBox(height: 32),

        // Back to Login Button
        SportsOSButton(
          text: 'Back to Login',
          onPressed: () {
            context.pop();
          },
        ).animate().fadeIn(delay: 300.ms),
        
        const SizedBox(height: 16),
        
        TextButton(
          onPressed: () {
            setState(() {
              _isSubmitted = false;
            });
          },
          child: const Text('Didn\'t receive the link? Try again'),
        ).animate().fadeIn(delay: 400.ms),
      ],
    );
  }
}



