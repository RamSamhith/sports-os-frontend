import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_animate/flutter_animate.dart';

import 'colors.dart';
import 'theme.dart';
import 'glass_container.dart';
import 'sports_os_button.dart';

import 'api_service.dart';

class EnquireScreen extends ConsumerStatefulWidget {
  final String academyId;

  const EnquireScreen({super.key, required this.academyId});

  @override
  ConsumerState<EnquireScreen> createState() => _EnquireScreenState();
}

class _EnquireScreenState extends ConsumerState<EnquireScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _phoneController = TextEditingController();
  final _emailController = TextEditingController();
  final _messageController = TextEditingController();
  bool _isLoading = false;

  @override
  void dispose() {
    _nameController.dispose();
    _phoneController.dispose();
    _emailController.dispose();
    _messageController.dispose();
    super.dispose();
  }

  void _submitEnquiry() async {
    if (_formKey.currentState!.validate()) {
      setState(() => _isLoading = true);

      final payload = {
        'targetType': 'academy',
        'targetId': widget.academyId,
        'intent': 'contact',
        'parentInfo': {
          'name': _nameController.text.trim(),
          'phone': _phoneController.text.trim(),
          'email': _emailController.text.trim().isEmpty ? 'no-email@example.com' : _emailController.text.trim(),
        },
        'sportInterest': 'General',
        'message': _messageController.text.trim(),
      };

      final response = await ApiService().submitEnquiry(payload);

      if (!mounted) return;
      setState(() => _isLoading = false);

      if (response['success'] == true) {
        showDialog(
          context: context,
          barrierDismissible: false,
          builder: (ctx) => AlertDialog(
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
            backgroundColor: ref.read(themeProvider) == ThemeMode.dark ? AppColors.inkDark : Colors.white,
            contentPadding: const EdgeInsets.all(24),
            content: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(Icons.check_circle, color: AppColors.green, size: 64)
                    .animate()
                    .scale(duration: 400.ms, curve: Curves.easeOutBack),
                const SizedBox(height: 16),
                Text(
                  'Enquiry Sent!',
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: ref.read(themeProvider) == ThemeMode.dark ? Colors.white : Colors.black,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'The academy will get back to you shortly.',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    color: ref.read(themeProvider) == ThemeMode.dark ? Colors.white70 : Colors.black54,
                  ),
                ),
                const SizedBox(height: 24),
                SportsOSButton(
                  text: 'Done',
                  onPressed: () {
                    Navigator.pop(ctx); // Close dialog
                    context.pop(); // Go back to details screen
                  },
                ),
              ],
            ),
          ),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(response['error'] ?? 'Failed to send enquiry. Please try again.'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String label,
    required IconData icon,
    TextInputType keyboardType = TextInputType.text,
    bool isDark = true,
    bool isOptional = false,
    int maxLines = 1,
  }) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 20.0),
      child: GlassContainer(
        opacity: isDark ? 0.05 : 0.5,
        blur: 15,
        child: TextFormField(
          controller: controller,
          keyboardType: keyboardType,
          maxLines: maxLines,
          style: TextStyle(
            color: isDark ? AppColors.textPrimary : Colors.black87,
          ),
          decoration: InputDecoration(
            labelText: isOptional ? '$label (Optional)' : label,
            labelStyle: TextStyle(
              color: isDark ? AppColors.textSecondary : Colors.black54,
            ),
            prefixIcon: maxLines == 1 
                ? Icon(icon, color: isDark ? AppColors.textSecondary : Colors.black54)
                : Padding(
                    padding: const EdgeInsets.only(bottom: 60),
                    child: Icon(icon, color: isDark ? AppColors.textSecondary : Colors.black54),
                  ),
            border: InputBorder.none,
            contentPadding: EdgeInsets.symmetric(horizontal: 20, vertical: maxLines > 1 ? 20 : 16),
          ),
          validator: (value) {
            if (!isOptional && (value == null || value.trim().isEmpty)) {
              return 'This field is required';
            }
            return null;
          },
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = ref.watch(themeProvider) == ThemeMode.dark;

    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: Icon(
            Icons.arrow_back_ios_new,
            color: isDark ? AppColors.textPrimary : AppColors.textLight,
            size: 20,
          ),
          onPressed: () => context.pop(),
        ),
        title: Text(
          'Enquiry',
          style: TextStyle(
            color: isDark ? AppColors.textPrimary : AppColors.textLight,
            fontSize: 16,
            fontWeight: FontWeight.bold,
          ),
        ),
        centerTitle: true,
      ),
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(24.0),
                child: Form(
                  key: _formKey,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'SEND\nENQUIRY',
                        style: GoogleFonts.barlowCondensed(
                          fontSize: 48,
                          fontWeight: FontWeight.w900,
                          height: 1.0,
                          color: isDark ? AppColors.textPrimary : AppColors.textLight,
                        ),
                      ).animate().fadeIn().slideX(begin: -0.1),
                      const SizedBox(height: 12),
                      Text(
                        'Fill in your details and we will pass your message directly to the academy.',
                        style: TextStyle(
                          fontSize: 16,
                          color: isDark ? AppColors.textSecondary : Colors.black87,
                        ),
                      ).animate().fadeIn(),
                      const SizedBox(height: 32),
                      
                      _buildTextField(
                        controller: _nameController,
                        label: 'Full Name',
                        icon: Icons.person_outline,
                        isDark: isDark,
                      ).animate().fadeIn().slideY(begin: 0.1, delay: 100.ms),
                      
                      _buildTextField(
                        controller: _phoneController,
                        label: 'Phone Number',
                        icon: Icons.phone_outlined,
                        keyboardType: TextInputType.phone,
                        isDark: isDark,
                      ).animate().fadeIn().slideY(begin: 0.1, delay: 150.ms),
                      
                      _buildTextField(
                        controller: _emailController,
                        label: 'Email Address',
                        icon: Icons.email_outlined,
                        keyboardType: TextInputType.emailAddress,
                        isDark: isDark,
                        isOptional: true,
                      ).animate().fadeIn().slideY(begin: 0.1, delay: 200.ms),
                      
                      _buildTextField(
                        controller: _messageController,
                        label: 'Your Message / Query',
                        icon: Icons.chat_bubble_outline,
                        isDark: isDark,
                        maxLines: 4,
                      ).animate().fadeIn().slideY(begin: 0.1, delay: 250.ms),
                    ],
                  ),
                ),
              ),
            ),
            
            // Fixed Bottom Button
            Container(
              padding: const EdgeInsets.all(24.0),
              decoration: BoxDecoration(
                color: isDark ? AppColors.inkDark : AppColors.inkLight,
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.05),
                    offset: const Offset(0, -4),
                    blurRadius: 16,
                  ),
                ],
              ),
              child: SportsOSButton(
                text: _isLoading ? 'Sending...' : 'Send Enquiry',
                onPressed: _isLoading ? () {} : _submitEnquiry,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
