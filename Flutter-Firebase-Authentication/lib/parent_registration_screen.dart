import 'dart:ui';
import 'package:flutter/material.dart';
import 'route_utils.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'colors.dart';
import 'theme.dart';
import 'sports_os_button.dart';
import 'glass_container.dart';
import 'social_login_button.dart';
import 'auth_provider.dart';

class ChildFormData {
  final TextEditingController nameController = TextEditingController();
  final TextEditingController ageController = TextEditingController();
  String selectedSport = 'Football';

  void dispose() {
    nameController.dispose();
    ageController.dispose();
  }
}

class ParentRegistrationScreen extends ConsumerStatefulWidget {
  final String role;
  const ParentRegistrationScreen({super.key, required this.role});

  @override
  ConsumerState<ParentRegistrationScreen> createState() =>
      _ParentRegistrationScreenState();
}

class _ParentRegistrationScreenState
    extends ConsumerState<ParentRegistrationScreen> {
  final _formKey = GlobalKey<FormState>();
  int _currentStep = 1;
  final int _totalSteps = 2; // Reduced to 2 steps
  bool _isLoading = false;

  // Parent Form Controllers
  final _parentNameController = TextEditingController();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();

  // Dynamic Children State
  final List<ChildFormData> _children = [ChildFormData()];

  final List<String> _sports = [
    'Football',
    'Cricket',
    'Basketball',
    'Tennis',
    'Swimming',
    'Martial Arts',
  ];

  @override
  void dispose() {
    _parentNameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    for (var child in _children) {
      child.dispose();
    }
    super.dispose();
  }

  void _addChild() {
    setState(() {
      _children.add(ChildFormData());
    });
  }

  void _removeChild(int index) {
    setState(() {
      _children[index].dispose();
      _children.removeAt(index);
    });
  }

  void _nextStep() async {
    if (_formKey.currentState!.validate()) {
      if (_currentStep < _totalSteps) {
        setState(() => _currentStep++);
      } else {
        setState(() => _isLoading = true);
        try {
          final childrenData = _children.map((c) => {
            'name': c.nameController.text,
            'age': c.ageController.text,
            'sport': c.selectedSport,
          }).toList();

          await ref.read(authStateProvider.notifier).registerWithEmail(
            _emailController.text,
            _passwordController.text,
            widget.role,
            {
              'name': _parentNameController.text,
              'parentName': _parentNameController.text,
              'phone': _phoneController.text,
              'children': childrenData,
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
  }) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 20.0),
      child: GlassContainer(
        opacity: isDark ? 0.05 : 0.5,
        blur: 15,
        child: TextFormField(
          controller: controller,
          keyboardType: keyboardType,
          obscureText: obscureText,
          style: TextStyle(
            color: isDark ? AppColors.textPrimary : Colors.black87,
          ),
          decoration: InputDecoration(
            labelText: label,
            labelStyle: TextStyle(
              color: isDark ? AppColors.textSecondary : Colors.black54,
            ),
            prefixIcon: Icon(
              icon,
              color: isDark ? AppColors.textSecondary : Colors.black54,
            ),
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
                            ? AppColors.green
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
                                : 'CHILDREN\nPROFILES',
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
                            : 'Add details for each future champion.',
                        style: TextStyle(
                          fontSize: 16,
                          color: isDark ? AppColors.textSecondary : Colors.black87,
                        ),
                      ).animate(key: ValueKey('sub_$_currentStep')).fadeIn(),
                      const SizedBox(height: 32),

                      if (_currentStep == 1) ...[
                        _buildTextField(
                          controller: _parentNameController,
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
                        ...List.generate(_children.length, (index) {
                          final child = _children[index];
                          return Container(
                            margin: const EdgeInsets.only(bottom: 32.0),
                            padding: const EdgeInsets.all(20),
                            decoration: BoxDecoration(
                              color: isDark ? AppColors.inkDark : Colors.white,
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(
                                color: isDark ? Colors.white12 : Colors.black12,
                              ),
                              boxShadow: [
                                if (!isDark)
                                  BoxShadow(
                                    color: Colors.black.withOpacity(0.05),
                                    blurRadius: 10,
                                    offset: const Offset(0, 4),
                                  )
                              ],
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Text(
                                      'Child ${index + 1}',
                                      style: TextStyle(
                                        color: isDark ? AppColors.textPrimary : Colors.black87,
                                        fontSize: 18,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                    if (_children.length > 1)
                                      IconButton(
                                        icon: const Icon(Icons.close, color: Colors.red),
                                        onPressed: () => _removeChild(index),
                                      ),
                                  ],
                                ),
                                const SizedBox(height: 20),
                                _buildTextField(
                                  controller: child.nameController,
                                  label: 'Child\'s Name',
                                  icon: Icons.face_outlined,
                                  isDark: isDark,
                                ),
                                _buildTextField(
                                  controller: child.ageController,
                                  label: 'Age',
                                  icon: Icons.cake_outlined,
                                  keyboardType: TextInputType.number,
                                  isDark: isDark,
                                ),
                                const SizedBox(height: 8),
                                Text(
                                  'Preferred Sport',
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
                                    final isSelected = child.selectedSport == sport;
                                    return ChoiceChip(
                                      label: Text(sport),
                                      selected: isSelected,
                                      onSelected: (selected) {
                                        if (selected) {
                                          setState(() => child.selectedSport = sport);
                                        }
                                      },
                                      selectedColor: AppColors.green.withOpacity(0.2),
                                      backgroundColor: Colors.transparent,
                                      shape: RoundedRectangleBorder(
                                        borderRadius: BorderRadius.circular(20),
                                        side: BorderSide(
                                          color: isSelected
                                              ? AppColors.green
                                              : (isDark ? Colors.white24 : Colors.black12),
                                        ),
                                      ),
                                      labelStyle: TextStyle(
                                        color: isSelected
                                            ? AppColors.green
                                            : (isDark ? Colors.white : Colors.black87),
                                        fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                                      ),
                                    );
                                  }).toList(),
                                ),
                              ],
                            ),
                          ).animate().fadeIn().slideY(begin: 0.1);
                        }),

                        // Add another child button
                        Center(
                          child: TextButton.icon(
                            onPressed: _addChild,
                            icon: const Icon(Icons.add, color: AppColors.green),
                            label: const Text(
                              'Add Another Child',
                              style: TextStyle(color: AppColors.green, fontWeight: FontWeight.bold),
                            ),
                          ),
                        ),
                        const SizedBox(height: 20),
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
