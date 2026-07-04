import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'auth_provider.dart';
import 'theme.dart';
import 'colors.dart';
import 'sports_os_button.dart';
import 'glass_container.dart';

class ForgotPasswordDialog extends ConsumerStatefulWidget {
  const ForgotPasswordDialog({super.key});

  @override
  ConsumerState<ForgotPasswordDialog> createState() => _ForgotPasswordDialogState();
}

class _ForgotPasswordDialogState extends ConsumerState<ForgotPasswordDialog> {
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

    return Dialog(
      backgroundColor: Colors.transparent,
      elevation: 0,
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
          child: _isSubmitted ? _buildSuccessView(isDark) : _buildFormView(isDark),
        ),
      ).animate().fadeIn().scale(begin: const Offset(0.9, 0.9)),
    );
  }

  Widget _buildFormView(bool isDark) {
    return Form(
      key: _formKey,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const SizedBox(width: 48), // Balance for close button
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
              IconButton(
                icon: Icon(Icons.close, color: isDark ? AppColors.textSecondary : Colors.black54),
                onPressed: () => Navigator.of(context).pop(),
              ),
            ],
          ),
          const SizedBox(height: 24),
          Text(
            'FORGOT PASSWORD?',
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
            'Enter your registered email address, and we\'ll send you instructions to reset your password.',
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 14,
              color: isDark ? AppColors.textSecondary : Colors.black54,
              height: 1.5,
            ),
          ),
          const SizedBox(height: 32),
          
          GlassContainer(
            opacity: isDark ? 0.05 : 0.5,
            blur: 15,
            child: TextFormField(
              controller: _emailController,
              style: TextStyle(
                color: isDark ? AppColors.textPrimary : Colors.black87,
              ),
              decoration: InputDecoration(
                labelText: 'Email Address',
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
                  return 'Please enter your email';
                }
                return null;
              },
            ),
          ),
          
          const SizedBox(height: 32),
          SportsOSButton(
            text: _isLoading ? 'Sending...' : 'Send Reset Link',
            onPressed: _isLoading ? () {} : () async {
              if (_formKey.currentState!.validate()) {
                setState(() => _isLoading = true);
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
                    setState(() => _isLoading = false);
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Failed to send reset link')),
                    );
                  }
                }
              }
            },
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
        Align(
          alignment: Alignment.topRight,
          child: IconButton(
            icon: Icon(Icons.close, color: isDark ? AppColors.textSecondary : Colors.black54),
            onPressed: () => Navigator.of(context).pop(),
          ),
        ),
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
          _successMessage.isNotEmpty 
              ? _successMessage 
              : 'password sent to your email successfully\n${_emailController.text}',
          textAlign: TextAlign.center,
          style: TextStyle(
            fontSize: 14,
            color: isDark ? AppColors.textSecondary : Colors.black54,
            height: 1.5,
          ),
        ),
        const SizedBox(height: 32),
        SportsOSButton(
          text: 'Back to Login',
          onPressed: () {
            Navigator.of(context).pop();
          },
        ),
      ],
    );
  }
}
