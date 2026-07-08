import 'package:flutter/material.dart';
import 'route_utils.dart';
import 'package:file_picker/file_picker.dart';
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

class CoachRegistrationScreen extends ConsumerStatefulWidget {
  const CoachRegistrationScreen({super.key});

  @override
  ConsumerState<CoachRegistrationScreen> createState() =>
      _CoachRegistrationScreenState();
}

class _CoachRegistrationScreenState
    extends ConsumerState<CoachRegistrationScreen> {
  final _formKey = GlobalKey<FormState>();
  int _currentStep = 1;
  final int _totalSteps = 3;
  bool _isLoading = false;

  // Form Controllers
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  final _phoneController = TextEditingController();
  final _experienceController = TextEditingController();
  final _academyController = TextEditingController();
  final _achievementsController = TextEditingController();

  final List<String> _selectedSports = ['Football'];
  final List<String> _specializations = [
    'Football',
    'Cricket',
    'Basketball',
    'Tennis',
    'Swimming',
    'Strength & Conditioning',
    'Athletics',
  ];
  
  final List<String> _uploadedCertificates = [];

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    _phoneController.dispose();
    _experienceController.dispose();
    _academyController.dispose();
    _achievementsController.dispose();
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
            'coach',
            {
              'name': _nameController.text,
              'coachName': _nameController.text,
              'phone': _phoneController.text,
              'experience': _experienceController.text,
              'academy': _academyController.text,
              'achievements': _achievementsController.text,
              'sports': _selectedSports.toList(),
              'certificates': _uploadedCertificates,
            },
          );
          
          if (!mounted) return;
          routeBasedOnRole(context, ref);
        } catch (e) {
          if (!mounted) return;
          setState(() => _isLoading = false);
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Registration failed: ${e.toString()}'),
              backgroundColor: Colors.red,
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
          obscureText: obscureText,
          maxLines: maxLines,
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
          'Coach Setup',
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
            // Progress Indicator
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
                                ? 'ACCOUNT\nDETAILS' 
                                : _currentStep == 2 
                                    ? 'PROFESSIONAL\nEXPERIENCE'
                                    : 'CREDENTIALS &\nACHIEVEMENTS',
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
                                ? 'Tell us about your coaching background.'
                                : 'Showcase your certificates and achievements.',
                        style: TextStyle(
                          fontSize: 16,
                          color: isDark ? AppColors.textSecondary : Colors.black87,
                        ),
                      ).animate(key: ValueKey('sub_$_currentStep')).fadeIn(),
                      const SizedBox(height: 32),

                      // Step 1: Account Details
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

                      // Step 2: Experience
                      if (_currentStep == 2) ...[
                        _buildTextField(
                          controller: _experienceController,
                          label: 'Years of Experience',
                          icon: Icons.work_history_outlined,
                          keyboardType: TextInputType.number,
                          isDark: isDark,
                        ),
                        _buildTextField(
                          controller: _academyController,
                          label: 'Academy Affiliation (Optional)',
                          icon: Icons.business_outlined,
                          isDark: isDark,
                          isOptional: true,
                        ),
                        const SizedBox(height: 16),
                        Text(
                          'Primary Specializations',
                          style: TextStyle(
                            color: isDark ? AppColors.textSecondary : Colors.black87,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 12),
                        Wrap(
                          spacing: 8,
                          runSpacing: 8,
                          children: _specializations.map((spec) {
                            final isSelected = _selectedSports.contains(spec);
                            return ChoiceChip(
                              label: Text(spec),
                              selected: isSelected,
                              onSelected: (selected) {
                                setState(() {
                                  if (selected) {
                                    _selectedSports.add(spec);
                                  } else {
                                    if (_selectedSports.length > 1) {
                                      _selectedSports.remove(spec);
                                    }
                                  }
                                });
                              },
                              selectedColor: AppColors.green.withValues(alpha: 0.2),
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
                      // Step 3: Credentials and Achievements
                      if (_currentStep == 3) ...[
                        Text(
                          'Upload Certificates',
                          style: TextStyle(
                            color: isDark ? AppColors.textSecondary : Colors.black87,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 12),
                        InkWell(
                          onTap: () async {
                            final result = await FilePicker.platform.pickFiles(
                              allowMultiple: true,
                              type: FileType.custom,
                              allowedExtensions: ['pdf', 'jpg', 'jpeg', 'png'],
                            );

                            if (result != null) {
                              setState(() {
                                for (var file in result.files) {
                                  _uploadedCertificates.add(file.name);
                                }
                              });
                            }
                          },
                          borderRadius: BorderRadius.circular(16),
                          child: Container(
                            width: double.infinity,
                            padding: const EdgeInsets.symmetric(vertical: 32),
                            decoration: BoxDecoration(
                              color: isDark ? AppColors.cardDark : AppColors.agSurface,
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(
                                color: isDark ? Colors.white24 : Colors.black12,
                                style: BorderStyle.solid,
                              ),
                            ),
                            child: Column(
                              children: [
                                Icon(
                                  Icons.cloud_upload_outlined,
                                  size: 48,
                                  color: isDark ? AppColors.textSecondary : Colors.black54,
                                ),
                                const SizedBox(height: 12),
                                Text(
                                  'Tap to upload files',
                                  style: TextStyle(
                                    color: isDark ? AppColors.textPrimary : Colors.black87,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  'PDF, JPG or PNG (max. 5MB)',
                                  style: TextStyle(
                                    color: isDark ? AppColors.textSecondary : Colors.black54,
                                    fontSize: 12,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(height: 16),
                        if (_uploadedCertificates.isNotEmpty) ...[
                          ..._uploadedCertificates.map((file) => Padding(
                                padding: const EdgeInsets.only(bottom: 8.0),
                                child: Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                                  decoration: BoxDecoration(
                                    color: isDark ? AppColors.card2Dark : Colors.white,
                                    borderRadius: BorderRadius.circular(12),
                                    border: Border.all(
                                      color: isDark ? Colors.white12 : Colors.black12,
                                    ),
                                  ),
                                  child: Row(
                                    children: [
                                      Icon(Icons.description_outlined, color: AppColors.blue, size: 20),
                                      const SizedBox(width: 12),
                                      Expanded(
                                        child: Text(
                                          file,
                                          style: TextStyle(
                                            color: isDark ? AppColors.textPrimary : Colors.black87,
                                          ),
                                        ),
                                      ),
                                      InkWell(
                                        onTap: () {
                                          setState(() {
                                            _uploadedCertificates.remove(file);
                                          });
                                        },
                                        child: const Icon(Icons.close, color: Colors.red, size: 20),
                                      ),
                                    ],
                                  ),
                                ),
                              )),
                          const SizedBox(height: 16),
                        ],
                        _buildTextField(
                          controller: _achievementsController,
                          label: 'Key Achievements & Accolades',
                          icon: Icons.emoji_events_outlined,
                          isDark: isDark,
                          isOptional: true,
                          maxLines: 5,
                        ),
                      ],
                    ],
                  ),
                ),
              ),
            ),

            // Bottom Buttons
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

