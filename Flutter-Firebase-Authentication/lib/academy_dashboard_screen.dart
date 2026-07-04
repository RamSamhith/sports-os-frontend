import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'colors.dart';
import 'theme.dart';
import 'auth_provider.dart';

class AcademyDashboardScreen extends ConsumerWidget {
  const AcademyDashboardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isDark = ref.watch(themeProvider) == ThemeMode.dark;
    
    return Scaffold(
      backgroundColor: isDark ? AppColors.inkDark : AppColors.inkLight,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: Text(
          'Academy Dashboard',
          style: TextStyle(
            color: isDark ? AppColors.textPrimary : Colors.black87,
            fontWeight: FontWeight.bold,
          ),
        ),
        actions: [
          IconButton(
            icon: Icon(
              Icons.logout,
              color: isDark ? AppColors.textPrimary : Colors.black87,
            ),
            onPressed: () {
              ref.read(authStateProvider.notifier).signOut();
              context.go('/welcome');
            },
          ),
        ],
      ),
      body: Center(
        child: Text(
          'Welcome to the Academy Dashboard!',
          style: TextStyle(
            color: isDark ? AppColors.textPrimary : Colors.black87,
            fontSize: 18,
          ),
        ),
      ),
    );
  }
}
