import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'colors.dart';
import 'theme.dart';
import 'sports_os_button.dart';

class WelcomeScreen extends ConsumerWidget {
  const WelcomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isDark = ref.watch(themeProvider) == ThemeMode.dark;

    return Scaffold(
      floatingActionButton: FloatingActionButton(
        backgroundColor: isDark ? AppColors.card2Dark : Colors.white,
        elevation: 4,
        child: Icon(
          isDark ? Icons.light_mode : Icons.dark_mode,
          color: isDark ? AppColors.textPrimary : AppColors.textLight,
        ),
        onPressed: () {
          ref.read(themeProvider.notifier).state =
              isDark ? ThemeMode.light : ThemeMode.dark;
        },
      ).animate().scale(delay: 800.ms),
      body: Stack(
        children: [
          // Base Background
          Container(
            decoration: BoxDecoration(
              gradient: RadialGradient(
                center: Alignment.topRight,
                radius: 1.5,
                colors: isDark
                    ? [AppColors.ink2Dark, AppColors.inkDark]
                    : [AppColors.inkLight, Colors.white],
              ),
            ),
          ),

          // Top Right Glow
          Positioned(
            top: -100,
            right: -100,
            child: Container(
              width: 450,
              height: 450,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: isDark 
                    ? AppColors.green.withValues(alpha: 0.15) 
                    : AppColors.agGlowEmerald.withValues(alpha: 0.35), // Increased significantly
              ),
            )
                .animate(
                  onPlay: (controller) => controller.repeat(reverse: true),
                )
                .scaleXY(end: 1.3, duration: 4.seconds)
                .blurXY(end: 120),
          ),

          // Bottom Left Glow
          Positioned(
            bottom: 50,
            left: -150,
            child: Container(
              width: 500,
              height: 500,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: isDark 
                    ? AppColors.blue.withValues(alpha: 0.1) 
                    : AppColors.agGlowTeal.withValues(alpha: 0.35), // Increased significantly
              ),
            )
                .animate(
                  onPlay: (controller) => controller.repeat(reverse: true),
                )
                .scaleXY(end: 1.4, duration: 5.seconds)
                .blurXY(end: 140),
          ),
          
          // Extra Middle Glow for Light Mode Enhancement
          if (!isDark)
            Positioned(
              top: MediaQuery.of(context).size.height * 0.3,
              right: -150,
              child: Container(
                width: 550,
                height: 550,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: AppColors.agGlowMint.withValues(alpha: 0.25), // Increased significantly
                ),
              )
                  .animate(
                    onPlay: (controller) => controller.repeat(reverse: true),
                  )
                  .slideX(begin: 0, end: -0.3, duration: 6.seconds)
                  .blurXY(end: 160),
            ),

          // Main UI Content
          SafeArea(
            child: Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Top Badge
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 14,
                      vertical: 8,
                    ),
                    decoration: BoxDecoration(
                      color: AppColors.greenDim,
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(
                        color: AppColors.green.withValues(alpha: 0.3),
                      ),
                    ),
                    child: const Text(
                      'SPORTS MANAGEMENT PLATFORM',
                      style: TextStyle(
                        color: AppColors.green,
                        fontSize: 11,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 0.5,
                      ),
                    ),
                  ).animate().fadeIn().slideX(),

                  const Spacer(),

                  // Hero Text
                  Text(
                    'YOUR\nSPORTS\nJOURNEY',
                    style: GoogleFonts.barlowCondensed(
                      fontSize: 72,
                      fontWeight: FontWeight.w900,
                      height: 1.0,
                      color:
                          isDark ? AppColors.textPrimary : AppColors.textLight,
                    ),
                  ).animate().fadeIn(duration: 600.ms).slideY(begin: 0.2),
                  const SizedBox(height: 16),

                  // Subtitle
                  Text(
                    'Connect with verified coaches, discover top academies & track your progress — all in one place.',
                    style: TextStyle(
                      fontSize: 16,
                      color: isDark ? AppColors.textSecondary : Colors.black87,
                      height: 1.5,
                    ),
                  ).animate().fadeIn(delay: 300.ms),
                  const SizedBox(height: 48),

                  // CTA Buttons
                  SportsOSButton(
                    text: 'Get Started →',
                    onPressed: () {
                      context.go('/home');
                    },
                  ).animate().fadeIn(delay: 500.ms),
                  const SizedBox(height: 16),
                  SportsOSButton(
                    text: 'Sign In to Account',
                    isGhost: true,
                    onPressed: () {
                      context.push('/signin');
                    },
                  ).animate().fadeIn(delay: 600.ms),
                  const SizedBox(height: 40),

                  // Glassmorphic Statistics Section
                  Center(
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(24),
                      child: BackdropFilter(
                        filter: ImageFilter.blur(sigmaX: 12, sigmaY: 12),
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                            vertical: 16,
                            horizontal: 20,
                          ),
                          decoration: BoxDecoration(
                            color: (isDark ? Colors.white : Colors.black)
                                .withValues(alpha: 0.05),
                            borderRadius: BorderRadius.circular(24),
                            border: Border.all(
                              color: (isDark ? Colors.white : Colors.black)
                                  .withValues(alpha: 0.1),
                            ),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              _StatItem(
                                value: '20+',
                                label: 'Academies',
                                isDark: isDark,
                              ),
                              _StatDivider(isDark: isDark),
                              _StatItem(
                                value: '8',
                                label: 'Sports',
                                isDark: isDark,
                              ),
                              _StatDivider(isDark: isDark),
                              _StatItem(
                                value: '100%',
                                label: 'Verified',
                                isDark: isDark,
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ).animate().fadeIn(delay: 800.ms).slideY(begin: 0.2),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _StatItem extends StatelessWidget {
  final String value;
  final String label;
  final bool isDark;

  const _StatItem({
    required this.value,
    required this.label,
    required this.isDark,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Text(
          value,
          style: TextStyle(
            fontWeight: FontWeight.w800,
            fontSize: 18,
            color: isDark ? AppColors.textPrimary : AppColors.textLight,
          ),
        ),
        const SizedBox(height: 2),
        Text(
          label,
          style: TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w600,
            color: isDark ? AppColors.textTertiary : Colors.black54,
          ),
        ),
      ],
    );
  }
}

class _StatDivider extends StatelessWidget {
  final bool isDark;
  const _StatDivider({required this.isDark});

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 32,
      width: 1,
      margin: const EdgeInsets.symmetric(horizontal: 16),
      color: isDark ? Colors.white24 : Colors.black12,
    );
  }
}
