import 'package:flutter/material.dart';

class AppColors {
  // Background layers (Dark)
  static const inkDark = Color(0xFF040D1C);
  static const ink2Dark = Color(0xFF071425);
  static const ink3Dark = Color(0xFF0C1F38);

  // Card layers (Dark)
  static const cardDark = Color(0xFF0F2040);
  static const card2Dark = Color(0xFF162A4E);
  static const card3Dark = Color(0xFF1C3460);

  // Accents
  static const green = Color(0xFF00F080);
  static const green2 = Color(0xFF00D46E);
  static const greenGlow = Color(0x5900F080);
  static const greenDim = Color(0x1F00F080);
  static const blue = Color(0xFF5AACFF);
  static const amber = Color(0xFFFFB830);

  // Text hierarchy (Dark)
  static const textPrimary = Color(0xFFFFFFFF);
  static const textSecondary = Color(0xFFC8DEFF);
  static const textTertiary = Color(0xFF7AACD4);

  // Anti-Gravity Light Mode Tokens (Professional Green Theme)
  static const agBackground = Color(0xFFF4F6F8);
  static const agSurface = Color(0xFFFFFFFF);
  static const agPrimary = Color(0xFF059669); // Professional Emerald
  static const agPrimaryTranslucent = Color(0x1F059669); // 12% opacity
  static const agTextNeutral = Color(0xFF202124);
  static const agTextMuted = Color(0xFF5F6368);
  static const agShadow = Color(0x0A000000); // 4% opacity
  
  // Engaging Professional Glows for Light Mode
  static const agGlowEmerald = Color(0xFF10B981);
  static const agGlowTeal = Color(0xFF0D9488);
  static const agGlowMint = Color(0xFF34D399);

  // Legacy Light Mode Tokens (Keep for fallback if needed)
  static const inkLight = Color(0xFFF8FAFF);
  static const cardLight = Color(0xFFFFFFFF);
  static const greenLight = Color(0xFF059669);
  static const blueLight = Color(0xFF2563EB);
  static const textLight = Color(0xFF0F172A);

  // Modern Engaging Gradients
  static const darkGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [
      Color(0xFF071425), // ink2Dark
      Color(0xFF040D1C), // inkDark
      Color(0xFF0C1F38), // ink3Dark
    ],
  );

  static const lightGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    stops: [0.0, 0.6, 1.0],
    colors: [
      Color(0xFFFFFFFF), // 60% Pure White
      Color(0xFFE6F4F1), // Transition
      Color(0xFF059669), // 40% Emerald Green
    ],
  );

  static const glassBorderDark = Color(0x33FFFFFF);
  static const glassBorderLight = Color(0x1A000000);
}
