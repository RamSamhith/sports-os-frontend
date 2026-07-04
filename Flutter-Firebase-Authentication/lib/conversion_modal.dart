import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'theme.dart';
import 'colors.dart';
import 'sports_os_button.dart';

void showConversionModal(BuildContext context, {required WidgetRef ref, required String actionName}) {
  final isDark = ref.read(themeProvider) == ThemeMode.dark;

  showModalBottomSheet(
    context: context,
    backgroundColor: Colors.transparent,
    isScrollControlled: true,
    builder: (context) {
      return BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
        child: Container(
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            color: isDark ? AppColors.inkDark.withValues(alpha: 0.85) : Colors.white.withValues(alpha: 0.9),
            borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
            border: Border.all(
              color: isDark ? Colors.white12 : Colors.black12,
            ),
          ),
          child: SafeArea(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  width: 40,
                  height: 4,
                  margin: const EdgeInsets.only(bottom: 24),
                  decoration: BoxDecoration(
                    color: isDark ? Colors.white24 : Colors.black12,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
                const Icon(
                  Icons.lock_person,
                  size: 48,
                  color: AppColors.agPrimary,
                ),
                const SizedBox(height: 16),
                Text(
                  'Sign In Required',
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: isDark ? Colors.white : Colors.black87,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'You need to sign in or create an account to $actionName. It only takes a minute!',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 16,
                    color: isDark ? Colors.white54 : Colors.black54,
                    height: 1.5,
                  ),
                ),
                const SizedBox(height: 32),
                SportsOSButton(
                  text: 'Sign In / Create Account',
                  onPressed: () {
                    context.pop(); // Close modal
                    context.push('/role'); // Go to registration/login
                  },
                ),
                const SizedBox(height: 16),
                SportsOSButton(
                  text: 'Maybe Later',
                  isGhost: true,
                  onPressed: () {
                    context.pop(); // Close modal
                  },
                ),
              ],
            ),
          ),
        ),
      );
    },
  );
}
