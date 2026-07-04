import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'theme.dart';
import 'colors.dart';

class SettingsScreen extends ConsumerStatefulWidget {
  const SettingsScreen({super.key});

  @override
  ConsumerState<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends ConsumerState<SettingsScreen> {
  bool _notificationsEnabled = true;

  void _showMockDialog(String title, String message, {bool isDestructive = false}) {
    final isDark = ref.read(themeProvider) == ThemeMode.dark;
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: isDark ? AppColors.cardDark : Colors.white,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: Text(
          title,
          style: TextStyle(color: isDark ? Colors.white : Colors.black87),
        ),
        content: Text(
          message,
          style: TextStyle(color: isDark ? Colors.white70 : Colors.black54),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text(
              'Cancel',
              style: TextStyle(color: isDark ? Colors.white54 : Colors.black54),
            ),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text('$title processed successfully'),
                  backgroundColor: isDestructive ? Colors.red : AppColors.green,
                ),
              );
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: isDestructive ? Colors.red : AppColors.green,
              foregroundColor: isDestructive ? Colors.white : Colors.black,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
            ),
            child: Text(isDestructive ? 'Delete' : 'Confirm'),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionHeader(String title, bool isDark) {
    return Padding(
      padding: const EdgeInsets.only(left: 8, bottom: 12, top: 24),
      child: Text(
        title.toUpperCase(),
        style: TextStyle(
          color: isDark ? AppColors.green : AppColors.agPrimary,
          fontSize: 12,
          fontWeight: FontWeight.bold,
          letterSpacing: 1.2,
        ),
      ),
    );
  }

  Widget _buildSettingsGroup({required List<Widget> children, required bool isDark}) {
    return Container(
      decoration: BoxDecoration(
        color: isDark ? AppColors.cardDark : Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: isDark ? Colors.white12 : Colors.black12),
        boxShadow: isDark
            ? []
            : [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.03),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                )
              ],
      ),
      child: Column(
        children: children,
      ),
    );
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
        title: Text(
          'Settings',
          style: GoogleFonts.barlowCondensed(
            color: isDark ? Colors.white : Colors.black87,
            fontSize: 28,
            fontWeight: FontWeight.bold,
          ),
        ),
        centerTitle: true,
      ),
      body: ListView(
        padding: const EdgeInsets.all(24),
        children: [
          _buildSectionHeader('Appearance', isDark),
          _buildSettingsGroup(
            isDark: isDark,
            children: [
              ListTile(
                leading: Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: isDark ? AppColors.card2Dark : AppColors.inkLight,
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    isDark ? Icons.dark_mode : Icons.light_mode,
                    color: isDark ? Colors.white : Colors.amber,
                  ),
                ),
                title: Text(
                  'Dark Mode',
                  style: TextStyle(
                    color: isDark ? AppColors.textPrimary : Colors.black87,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                trailing: Switch.adaptive(
                  value: isDark,
                  activeColor: AppColors.green,
                  onChanged: (value) {
                    ref.read(themeProvider.notifier).state =
                        value ? ThemeMode.dark : ThemeMode.light;
                  },
                ),
              ),
            ],
          ).animate().fadeIn(delay: 100.ms).slideY(begin: 0.1),

          _buildSectionHeader('Account & Security', isDark),
          _buildSettingsGroup(
            isDark: isDark,
            children: [
              ListTile(
                leading: Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: isDark ? AppColors.card2Dark : AppColors.inkLight,
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.lock_outline, color: AppColors.blue),
                ),
                title: Text(
                  'Change Password',
                  style: TextStyle(
                    color: isDark ? AppColors.textPrimary : Colors.black87,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                trailing: Icon(Icons.chevron_right, color: isDark ? Colors.white54 : Colors.black54),
                onTap: () {
                  _showMockDialog('Change Password', 'Are you sure you want to change your password? A reset link will be sent to your email.');
                },
              ),
              Divider(height: 1, indent: 64, color: isDark ? Colors.white12 : Colors.black12),
              ListTile(
                leading: Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: Colors.red.withValues(alpha: 0.1),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.delete_outline, color: Colors.red),
                ),
                title: const Text(
                  'Delete Account',
                  style: TextStyle(
                    color: Colors.red,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                onTap: () {
                  _showMockDialog(
                    'Delete Account',
                    'This action is irreversible. All your data will be permanently lost.',
                    isDestructive: true,
                  );
                },
              ),
            ],
          ).animate().fadeIn(delay: 200.ms).slideY(begin: 0.1),

          _buildSectionHeader('App Settings', isDark),
          _buildSettingsGroup(
            isDark: isDark,
            children: [
              ListTile(
                leading: Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: isDark ? AppColors.card2Dark : AppColors.inkLight,
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.notifications_outlined, color: AppColors.green),
                ),
                title: Text(
                  'Push Notifications',
                  style: TextStyle(
                    color: isDark ? AppColors.textPrimary : Colors.black87,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                trailing: Switch.adaptive(
                  value: _notificationsEnabled,
                  activeColor: AppColors.green,
                  onChanged: (value) {
                    setState(() => _notificationsEnabled = value);
                  },
                ),
              ),
            ],
          ).animate().fadeIn(delay: 300.ms).slideY(begin: 0.1),

          _buildSectionHeader('About', isDark),
          _buildSettingsGroup(
            isDark: isDark,
            children: [
              ListTile(
                leading: Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: isDark ? AppColors.card2Dark : AppColors.inkLight,
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.description_outlined, color: AppColors.amber),
                ),
                title: Text(
                  'Terms of Service',
                  style: TextStyle(
                    color: isDark ? AppColors.textPrimary : Colors.black87,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                trailing: Icon(Icons.chevron_right, color: isDark ? Colors.white54 : Colors.black54),
                onTap: () {},
              ),
              Divider(height: 1, indent: 64, color: isDark ? Colors.white12 : Colors.black12),
              ListTile(
                leading: Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: isDark ? AppColors.card2Dark : AppColors.inkLight,
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.privacy_tip_outlined, color: AppColors.green),
                ),
                title: Text(
                  'Privacy Policy',
                  style: TextStyle(
                    color: isDark ? AppColors.textPrimary : Colors.black87,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                trailing: Icon(Icons.chevron_right, color: isDark ? Colors.white54 : Colors.black54),
                onTap: () {},
              ),
            ],
          ).animate().fadeIn(delay: 400.ms).slideY(begin: 0.1),

          const SizedBox(height: 40),
          Center(
            child: Text(
              'SportsOS v1.0.0',
              style: TextStyle(
                color: isDark ? Colors.white38 : Colors.black38,
                fontSize: 12,
              ),
            ),
          ).animate().fadeIn(delay: 500.ms),
          const SizedBox(height: 24),
        ],
      ),
    );
  }
}
