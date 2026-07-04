import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'colors.dart';

final themeProvider = StateProvider<ThemeMode>((ref) => ThemeMode.dark);

class SportsOSTheme {
  static ThemeData dark() => ThemeData(
    brightness: Brightness.dark,
    scaffoldBackgroundColor: AppColors.inkDark,
    colorScheme: const ColorScheme.dark(
      primary: AppColors.green,
      secondary: AppColors.blue,
      surface: AppColors.cardDark,
    ),
    textTheme: GoogleFonts.plusJakartaSansTextTheme(ThemeData.dark().textTheme),
  );

  static ThemeData light() {
    final baseTextTheme = GoogleFonts.plusJakartaSansTextTheme(ThemeData.light().textTheme);

    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      scaffoldBackgroundColor: AppColors.agBackground,
      colorScheme: const ColorScheme.light(
        primary: AppColors.agPrimary,
        secondary: AppColors.agPrimary,
        surface: AppColors.agSurface,
        onSurface: AppColors.agTextNeutral,
        onPrimary: Colors.white,
      ),
      textTheme: baseTextTheme.copyWith(
        displayLarge: baseTextTheme.displayLarge?.copyWith(color: AppColors.agTextNeutral, fontWeight: FontWeight.bold),
        displayMedium: baseTextTheme.displayMedium?.copyWith(color: AppColors.agTextNeutral, fontWeight: FontWeight.bold),
        displaySmall: baseTextTheme.displaySmall?.copyWith(color: AppColors.agTextNeutral, fontWeight: FontWeight.bold),
        headlineLarge: baseTextTheme.headlineLarge?.copyWith(color: AppColors.agTextNeutral, fontWeight: FontWeight.bold),
        headlineMedium: baseTextTheme.headlineMedium?.copyWith(color: AppColors.agTextNeutral, fontWeight: FontWeight.bold),
        headlineSmall: baseTextTheme.headlineSmall?.copyWith(color: AppColors.agTextNeutral, fontWeight: FontWeight.bold),
        titleLarge: baseTextTheme.titleLarge?.copyWith(color: AppColors.agTextNeutral, fontWeight: FontWeight.bold),
        titleMedium: baseTextTheme.titleMedium?.copyWith(color: AppColors.agTextNeutral, fontWeight: FontWeight.w600),
        titleSmall: baseTextTheme.titleSmall?.copyWith(color: AppColors.agTextNeutral, fontWeight: FontWeight.w600),
        bodyLarge: baseTextTheme.bodyLarge?.copyWith(color: AppColors.agTextNeutral),
        bodyMedium: baseTextTheme.bodyMedium?.copyWith(color: AppColors.agTextNeutral),
        bodySmall: baseTextTheme.bodySmall?.copyWith(color: AppColors.agTextMuted),
        labelLarge: baseTextTheme.labelLarge?.copyWith(color: AppColors.agTextMuted),
        labelMedium: baseTextTheme.labelMedium?.copyWith(color: AppColors.agTextMuted),
        labelSmall: baseTextTheme.labelSmall?.copyWith(color: AppColors.agTextMuted),
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: Colors.transparent,
        elevation: 0,
        scrolledUnderElevation: 0, // Keeps it flat until explicitly styled
        iconTheme: IconThemeData(color: AppColors.agTextNeutral),
        titleTextStyle: TextStyle(
          color: AppColors.agTextNeutral,
          fontSize: 20,
          fontWeight: FontWeight.bold,
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: Colors.black.withValues(alpha: 0.03),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: BorderSide.none,
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: BorderSide.none,
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: const BorderSide(color: AppColors.agPrimary, width: 1.5),
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
        hintStyle: const TextStyle(color: AppColors.agTextMuted),
      ),
      floatingActionButtonTheme: FloatingActionButtonThemeData(
        backgroundColor: AppColors.agPrimary,
        foregroundColor: Colors.white,
        elevation: 0,
        focusElevation: 0,
        hoverElevation: 0,
        highlightElevation: 0,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      ),
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
    );
  }
}

class AntiGravityStyle {
  /// Custom decoration template for 'floating' card elements
  static BoxDecoration floatingCard({
    double borderRadius = 24.0,
    Color color = AppColors.agSurface,
  }) {
    return BoxDecoration(
      color: color,
      borderRadius: BorderRadius.circular(borderRadius),
      boxShadow: [
        BoxShadow(
          color: AppColors.agShadow,
          blurRadius: 24,
          spreadRadius: 0,
          offset: const Offset(0, 8),
        ),
      ],
    );
  }

  /// Custom decoration template for floating bottom navigation bars
  static BoxDecoration floatingNavBar() {
    return BoxDecoration(
      color: AppColors.agSurface.withValues(alpha: 0.9),
      borderRadius: BorderRadius.circular(32),
      boxShadow: [
        BoxShadow(
          color: AppColors.agShadow,
          blurRadius: 20,
          spreadRadius: 0,
          offset: const Offset(0, 4),
        ),
      ],
    );
  }
}
