import 'dart:ui';
import 'package:flutter/material.dart';
import 'route_utils.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'auth_provider.dart';
import 'colors.dart';
import 'theme.dart';
import 'sports_os_button.dart';
import 'glass_container.dart';
import 'social_login_button.dart';

class StudentRegistrationScreen extends ConsumerStatefulWidget {
  final String role;
  const StudentRegistrationScreen({super.key, required this.role});

  @override
  ConsumerState<StudentRegistrationScreen> createState() =>
      _StudentRegistrationScreenState();
}

class _StudentRegistrationScreenState
    extends ConsumerState<StudentRegistrationScreen> {
  final _formKey = GlobalKey<FormState>();
  int _currentStep = 1;
  final int _totalSteps = 3;
  bool _isLoading = false;

  // Form Controllers
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  final _dobController = TextEditingController();
  final _goalsController = TextEditingController();

  Set<String> _selectedSports = {'Football'};
  final List<String> _sports = [
    'Football',
    'Cricket',
    'Basketball',
    'Tennis',
    'Swimming',
    'Martial Arts',
    'Fitness',
  ];

  String _selectedLevel = 'Beginner';
  final List<String> _levels = [
    'Beginner',
    'Intermediate',
    'Advanced',
    'Professional',
  ];

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    _dobController.dispose();
    _goalsController.dispose();
    super.dispose();
  }

  void _nextStep() async {
    if (_formKey.currentState!.validate()) {
      if (_currentStep < _totalSteps) {
        setState(() => _currentStep++);
      } else {
        setState(() => _isLoading = true);
        try {
          await ref.read(authStateProvider.notifier).registerWithEmail(
            _emailController.text,
            _passwordController.text,
            widget.role,
            {
              'name': _nameController.text,
              'phone': _phoneController.text,
              'dob': _dobController.text,
              'sports': _selectedSports.toList(),
              'level': _selectedLevel,
              'goals': _goalsController.text,
            },
          );
          
          if (!mounted) return;
          routeBasedOnRole(context, ref);
        } catch (e) {
          if (!mounted) return;
          setState(() => _isLoading = false);
          showDialog(
            context: context,
            builder: (ctx) => AlertDialog(
              title: const Text('Registration Failed', style: TextStyle(color: Colors.red)),
              content: Text(e.toString()),
              actions: [
                TextButton(
                  onPressed: () => Navigator.pop(ctx),
                  child: const Text('OK'),
                ),
              ],
            ),
          );
        }
      }
    }
  }

  void _prevStep() {
    if (_currentStep > 1) {
      setState(() => _currentStep--);
    } else {
      context.pop();
    }
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String label,
    required IconData icon,
    TextInputType keyboardType = TextInputType.text,
    bool isDark = true,
    bool isOptional = false,
    bool obscureText = false,
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
          obscureText: obscureText,
          style: TextStyle(
            color: isDark ? AppColors.textPrimary : Colors.black87,
          ),
          decoration: InputDecoration(
            labelText: label,
            labelStyle: TextStyle(
              color: isDark ? AppColors.textSecondary : Colors.black54,
            ),
            prefixIcon: icon != Icons.edit ? Icon(
              icon,
              color: isDark ? AppColors.textSecondary : Colors.black54,
            ) : null,
            border: InputBorder.none,
            contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
          ),
          validator: (value) {
            if (!isOptional && (value == null || value.isEmpty)) {
              return 'Required field';
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
          onPressed: _prevStep,
        ),
        title: Text(
          '${widget.role} Setup',
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
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 8.0),
              child: Row(
                children: List.generate(_totalSteps, (index) {
                  return Expanded(
                    child: Container(
                      margin: EdgeInsets.only(right: index == _totalSteps - 1 ? 0 : 8),
                      height: 4,
                      decoration: BoxDecoration(
                        color: index < _currentStep
                            ? AppColors.blue
                            : (isDark ? Colors.white24 : Colors.black12),
                        borderRadius: BorderRadius.circular(2),
                      ),
                    ),
                  );
                }),
              ).animate().fadeIn(),
            ),

            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(24.0),
                child: Form(
                  key: _formKey,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        _currentStep == 1
                            ? 'YOUR\nDETAILS'
                            : _currentStep == 2
                                ? 'SPORTS\nPROFILE'
                                : 'YOUR\nGOALS',
                        style: GoogleFonts.barlowCondensed(
                          fontSize: 48,
                          fontWeight: FontWeight.w900,
                          height: 1.0,
                          color: isDark ? AppColors.textPrimary : AppColors.textLight,
                        ),
                      )
                          .animate(key: ValueKey(_currentStep))
                          .fadeIn()
                          .slideX(begin: -0.1),
                      const SizedBox(height: 12),
                      Text(
                        _currentStep == 1
                            ? 'Let\'s start with your basic contact information.'
                            : _currentStep == 2
                                ? 'Tell us about your sports interests.'
                                : 'What are you aiming to achieve?',
                        style: TextStyle(
                          fontSize: 16,
                          color: isDark ? AppColors.textSecondary : Colors.black87,
                        ),
                      ).animate(key: ValueKey('sub_$_currentStep')).fadeIn(),
                      const SizedBox(height: 32),

                      if (_currentStep == 1) ...[
                        _buildTextField(
                          controller: _nameController,
                          label: 'Full Name',
                          icon: Icons.person_outline,
                          isDark: isDark,
                        ),
                        _buildTextField(
                          controller: _emailController,
                          label: 'Email Address',
                          icon: Icons.email_outlined,
                          keyboardType: TextInputType.emailAddress,
                          isDark: isDark,
                        ),
                        _buildTextField(
                          controller: _phoneController,
                          label: 'Phone Number',
                          icon: Icons.phone_outlined,
                          keyboardType: TextInputType.phone,
                          isDark: isDark,
                        ),
                        _buildTextField(
                          controller: _passwordController,
                          label: 'Password',
                          icon: Icons.lock_outline,
                          obscureText: true,
                          isDark: isDark,
                        ),
                        _buildTextField(
                          controller: _confirmPasswordController,
                          label: 'Confirm Password',
                          icon: Icons.lock_outline,
                          obscureText: true,
                          isDark: isDark,
                        ),
                        
                        const SizedBox(height: 24),
                        Row(
                          children: [
                            Expanded(child: Divider(color: isDark ? Colors.white24 : Colors.black12)),
                            Padding(
                              padding: const EdgeInsets.symmetric(horizontal: 16),
                              child: Text(
                                'OR SIGN UP WITH',
                                style: TextStyle(
                                  color: isDark ? AppColors.textSecondary : Colors.black54,
                                  fontSize: 12,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                            Expanded(child: Divider(color: isDark ? Colors.white24 : Colors.black12)),
                          ],
                        ),
                        const SizedBox(height: 24),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          children: [
                            SocialLoginButton(
                              type: SocialType.google,
                              onPressed: () async {
                                try {
                                  await ref.read(authControllerProvider).loginWithGoogle();
                                  if (mounted) routeBasedOnRole(context, ref);
                                } catch (e) {
                                  // Ignore error for now
                                }
                              },
                            ),
                          ],
                        ),
                        const SizedBox(height: 12),
                      ],

                      if (_currentStep == 2) ...[
                        Text(
                          'Primary Sport',
                          style: TextStyle(
                            color: isDark ? AppColors.textSecondary : Colors.black87,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 12),
                        Wrap(
                          spacing: 8,
                          runSpacing: 8,
                          children: _sports.map((sport) {
                            final isSelected = _selectedSports.contains(sport);
                            return FilterChip(
                              label: Text(sport),
                              selected: isSelected,
                              onSelected: (selected) {
                                setState(() {
                                  if (selected) {
                                    _selectedSports.add(sport);
                                  } else {
                                    _selectedSports.remove(sport);
                                  }
                                });
                              },
                              selectedColor: AppColors.blue.withOpacity(0.2),
                              backgroundColor: Colors.transparent,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(20),
                                side: BorderSide(
                                  color: isSelected
                                      ? AppColors.blue
                                      : (isDark ? Colors.white24 : Colors.black12),
                                ),
                              ),
                              labelStyle: TextStyle(
                                color: isSelected
                                    ? AppColors.blue
                                    : (isDark ? Colors.white : Colors.black87),
                                fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                              ),
                            );
                          }).toList(),
                        ),
                        const SizedBox(height: 32),
                        Text(
                          'Skill Level',
                          style: TextStyle(
                            color: isDark ? AppColors.textSecondary : Colors.black87,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 12),
                        Wrap(
                          spacing: 8,
                          runSpacing: 8,
                          children: _levels.map((level) {
                            final isSelected = _selectedLevel == level;
                            return ChoiceChip(
                              label: Text(level),
                              selected: isSelected,
                              onSelected: (selected) {
                                if (selected) {
                                  setState(() => _selectedLevel = level);
                                }
                              },
                              selectedColor: AppColors.blue.withOpacity(0.2),
                              backgroundColor: Colors.transparent,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(20),
                                side: BorderSide(
                                  color: isSelected
                                      ? AppColors.blue
                                      : (isDark ? Colors.white24 : Colors.black12),
                                ),
                              ),
                              labelStyle: TextStyle(
                                color: isSelected
                                    ? AppColors.blue
                                    : (isDark ? Colors.white : Colors.black87),
                                fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                              ),
                            );
                          }).toList(),
                        ),
                      ],

                      if (_currentStep == 3) ...[
                        _buildTextField(
                          controller: _goalsController,
                          label: 'My Goals (Optional)',
                          icon: Icons.flag,
                          isDark: isDark,
                          isOptional: true,
                          maxLines: 3,
                        ),
                      ],
                    ],
                  ),
                ),
              ),
            ),

            Container(
              padding: const EdgeInsets.all(24.0),
              decoration: BoxDecoration(
                color: isDark ? AppColors.inkDark : AppColors.inkLight,
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.05),
                    offset: const Offset(0, -4),
                    blurRadius: 16,
                  ),
                ],
              ),
              child: SportsOSButton(
                text: _isLoading ? 'Loading...' : (_currentStep < _totalSteps ? 'Continue' : 'Complete Setup'),
                onPressed: _isLoading ? () {} : _nextStep,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
