import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'colors.dart';
import 'theme.dart';

class SportsOSButton extends ConsumerWidget {
  final String text;
  final VoidCallback onPressed;
  final bool isGhost;
  final Widget? icon;

  const SportsOSButton({
    super.key,
    required this.text,
    required this.onPressed,
    this.isGhost = false,
    this.icon,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isDark = ref.watch(themeProvider) == ThemeMode.dark;

    return GestureDetector(
      onTap: onPressed,
      child:
          Container(
                width: double.infinity,
                padding: const EdgeInsets.symmetric(vertical: 16),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(16), // Rounded fully
                  gradient: isGhost
                      ? null
                      : (isDark
                          ? const LinearGradient(colors: [AppColors.green, AppColors.green2])
                          : const LinearGradient(colors: [AppColors.agGlowEmerald, AppColors.agPrimary])), // Professional Green Gradient
                  border: isGhost
                      ? Border.all(
                          color: isDark ? AppColors.textPrimary : AppColors.agTextNeutral.withValues(alpha: 0.1),
                        )
                      : null,
                  boxShadow: isGhost
                      ? []
                      : (isDark
                          ? [BoxShadow(color: AppColors.greenGlow, blurRadius: 20, spreadRadius: 2)]
                          : [BoxShadow(color: AppColors.agPrimary.withValues(alpha: 0.25), blurRadius: 24, offset: const Offset(0, 8))]), // Anti-gravity elevated button shadow
                ),
                alignment: Alignment.center,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    if (icon != null) ...[
                      icon!,
                      const SizedBox(width: 8),
                    ],
                    Text(
                      text,
                      style: TextStyle(
                        color: isGhost
                            ? (isDark ? AppColors.textPrimary : AppColors.agTextNeutral)
                            : (isDark ? AppColors.inkDark : Colors.white),
                        fontWeight: FontWeight.w700,
                        fontSize: 16,
                      ),
                    ),
                  ],
                ),
              )
              .animate(onPlay: (controller) => controller.repeat(reverse: true))
              .shimmer(duration: 2.seconds, color: Colors.white24, angle: 1),
    );
  }
}
