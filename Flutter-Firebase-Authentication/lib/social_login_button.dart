import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'theme.dart';

enum SocialType { google, microsoft }

class SocialLoginButton extends ConsumerStatefulWidget {
  final SocialType type;
  final VoidCallback onPressed;

  const SocialLoginButton({
    super.key,
    required this.type,
    required this.onPressed,
  });

  @override
  ConsumerState<SocialLoginButton> createState() => _SocialLoginButtonState();
}

class _SocialLoginButtonState extends ConsumerState<SocialLoginButton> {
  bool _isHovered = false;

  Widget _buildMicrosoftLogo() {
    return SizedBox(
      width: 21,
      height: 21,
      child: Column(
        children: [
          Expanded(
            child: Row(
              children: [
                Expanded(child: Container(color: const Color(0xFFF25022), margin: const EdgeInsets.all(0.5))),
                Expanded(child: Container(color: const Color(0xFF7FBA00), margin: const EdgeInsets.all(0.5))),
              ],
            ),
          ),
          Expanded(
            child: Row(
              children: [
                Expanded(child: Container(color: const Color(0xFF00A4EF), margin: const EdgeInsets.all(0.5))),
                Expanded(child: Container(color: const Color(0xFFFFB900), margin: const EdgeInsets.all(0.5))),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildGoogleLogo() {
    return Container(
      width: 18,
      height: 18,
      decoration: const BoxDecoration(
        color: Colors.white,
        shape: BoxShape.circle,
      ),
      child: Image.network(
        'https://img.icons8.com/color/48/000000/google-logo.png',
        fit: BoxFit.contain,
        errorBuilder: (context, error, stackTrace) {
          return const Text('G', style: TextStyle(color: Colors.red, fontWeight: FontWeight.bold));
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = ref.watch(themeProvider) == ThemeMode.dark;
    final isGoogle = widget.type == SocialType.google;
    
    // Official styling guidelines (Adaptive)
    final backgroundColor = isDark 
        ? (isGoogle ? const Color(0xFF131314) : const Color(0xFF2F2F2F))
        : Colors.white;
        
    final hoverColor = isDark
        ? (isGoogle ? const Color(0xFF1E1E1F) : const Color(0xFF1F1F1F))
        : const Color(0xFFF8F8F8);
        
    final textColor = isDark 
        ? Colors.white 
        : (isGoogle ? const Color(0xFF757575) : const Color(0xFF5E5E5E));
        
    final borderColor = isDark
        ? (isGoogle ? const Color(0xFF8E918F).withValues(alpha: 0.5) : Colors.transparent)
        : (isGoogle ? const Color(0xFFDDDDDD) : const Color(0xFF8C8C8C));
        
    final borderRadius = BorderRadius.circular(isGoogle ? 4.0 : 2.0);
    
    final text = isGoogle ? 'Continue with Google' : 'Continue with Microsoft';
    final textStyle = isGoogle 
        ? GoogleFonts.roboto(
            fontSize: 14,
            fontWeight: FontWeight.w500,
            color: textColor,
          )
        : TextStyle(
            fontSize: 15,
            fontWeight: FontWeight.w600,
            color: textColor,
            fontFamily: 'Segoe UI', // Fallback to system sans-serif if not available
          );

    return MouseRegion(
      onEnter: (_) => setState(() => _isHovered = true),
      onExit: (_) => setState(() => _isHovered = false),
      cursor: SystemMouseCursors.click,
      child: GestureDetector(
        onTap: widget.onPressed,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 150),
          height: 40, // Standard height for these buttons
          decoration: BoxDecoration(
            color: _isHovered ? hoverColor : backgroundColor,
            borderRadius: borderRadius,
            border: (isGoogle || !isDark) ? Border.all(color: borderColor, width: 1) : null,
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: isGoogle ? 0.08 : 0.2),
                blurRadius: _isHovered ? 3 : 2,
                offset: const Offset(0, 1),
              ),
            ],
          ),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center, // Center the whole row
              children: [
                isGoogle ? _buildGoogleLogo() : _buildMicrosoftLogo(),
                const SizedBox(width: 12),
                Text(text, style: textStyle),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
