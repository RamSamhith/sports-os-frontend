import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'colors.dart';
import 'theme.dart';
import 'sports_os_button.dart';

class StudentSignInScreen extends ConsumerStatefulWidget {
  const StudentSignInScreen({super.key});

  @override
  ConsumerState<StudentSignInScreen> createState() =>
      _StudentSignInScreenState();
}

class _StudentSignInScreenState extends ConsumerState<StudentSignInScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _obscurePassword = true;
  bool _rememberMe = false;
  bool _isLoading = false;
  String? _errorMessage;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _handleSignIn() async {
    setState(() => _errorMessage = null);
    if (_formKey.currentState!.validate()) {
      setState(() => _isLoading = true);

      // Simulate network request
      await Future.delayed(const Duration(seconds: 2));

      if (!mounted) return;

      if (_emailController.text.trim().toLowerCase() == 'error') {
        setState(() {
          _errorMessage = 'Invalid credentials. Please try again.';
          _isLoading = false;
        });
      } else {
        context.go('/home');
      }
    }
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
          icon: Icon(
            Icons.arrow_back_ios_new,
            color: isDark ? AppColors.textPrimary : AppColors.textLight,
            size: 20,
          ),
          onPressed: () => context.pop(),
        ),
        title: const Text(
          'Sports OS',
          style: TextStyle(
            color: AppColors.green,
            fontWeight: FontWeight.bold,
            letterSpacing: 1.2,
          ),
        ),
        centerTitle: true,
      ),
      body: Stack(
        children: [
          // Background Glows
          Positioned(
            top: -100,
            right: -50,
            child: Container(
              width: 300,
              height: 300,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: AppColors.green.withValues(
                  alpha: isDark ? 0.1 : 0.05,
                ),
              ),
            )
                .animate(onPlay: (c) => c.repeat(reverse: true))
                .blurXY(end: 80)
                .scaleXY(end: 1.2, duration: 4.seconds),
          ),

          SafeArea(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 24.0),
              child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const SizedBox(height: 10),
                    Text(
                      'STUDENT\nLOGIN',
                      style: GoogleFonts.barlowCondensed(
                        fontSize: 56,
                        fontWeight: FontWeight.w900,
                        height: 1.0,
                        color: isDark
                            ? AppColors.textPrimary
                            : AppColors.textLight,
                      ),
                    ).animate().fadeIn(duration: 500.ms).slideX(begin: -0.2),
                    const SizedBox(height: 12),
                    Text(
                      'Track your sports journey.',
                      style: TextStyle(
                        fontSize: 16,
                        color:
                            isDark ? AppColors.textSecondary : Colors.black87,
                        height: 1.5,
                      ),
                    ).animate().fadeIn(delay: 200.ms),
                    const SizedBox(height: 32),

                    // Error Message
                    if (_errorMessage != null)
                      Container(
                        padding: const EdgeInsets.all(12),
                        margin: const EdgeInsets.only(bottom: 24),
                        decoration: BoxDecoration(
                          color: Colors.red.withValues(alpha: 0.1),
                          border: Border.all(
                            color: Colors.red.withValues(alpha: 0.3),
                          ),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Row(
                          children: [
                            const Icon(
                              Icons.error_outline,
                              color: Colors.red,
                              size: 20,
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Text(
                                _errorMessage!,
                                style: const TextStyle(color: Colors.red),
                              ),
                            ),
                          ],
                        ),
                      ).animate().fadeIn().slideY(begin: -0.1),

                    // Email Field
                    TextFormField(
                      controller: _emailController,
                      style: TextStyle(
                        color: isDark ? AppColors.textPrimary : Colors.black87,
                      ),
                      decoration: InputDecoration(
                        labelText: 'Email or Mobile Number',
                        prefixIcon: const Icon(Icons.person_outline),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      validator: (value) => value == null || value.isEmpty
                          ? 'Required field'
                          : null,
                    ).animate().fadeIn(delay: 300.ms).slideY(begin: 0.1),
                    const SizedBox(height: 20),

                    // Password Field
                    TextFormField(
                      controller: _passwordController,
                      obscureText: _obscurePassword,
                      style: TextStyle(
                        color: isDark ? AppColors.textPrimary : Colors.black87,
                      ),
                      decoration: InputDecoration(
                        labelText: 'Password',
                        prefixIcon: const Icon(Icons.lock_outline),
                        suffixIcon: IconButton(
                          icon: Icon(
                            _obscurePassword
                                ? Icons.visibility_off
                                : Icons.visibility,
                          ),
                          onPressed: () => setState(
                            () => _obscurePassword = !_obscurePassword,
                          ),
                        ),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      validator: (value) => value == null || value.isEmpty
                          ? 'Required field'
                          : null,
                    ).animate().fadeIn(delay: 400.ms).slideY(begin: 0.1),

                    const SizedBox(height: 12),

                    // Remember Me & Forgot Password
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            SizedBox(
                              height: 24,
                              width: 24,
                              child: Checkbox(
                                value: _rememberMe,
                                onChanged: (value) => setState(
                                  () => _rememberMe = value ?? false,
                                ),
                                activeColor: AppColors.green,
                                checkColor: Colors.black,
                              ),
                            ),
                            const SizedBox(width: 8),
                            Text(
                              'Remember me',
                              style: TextStyle(
                                color: isDark
                                    ? AppColors.textSecondary
                                    : Colors.black87,
                                fontSize: 13,
                              ),
                            ),
                          ],
                        ),
                        TextButton(
                          onPressed: () {},
                          child: const Text('Forgot Password?'),
                        ),
                      ],
                    ).animate().fadeIn(delay: 500.ms),

                    const SizedBox(height: 24),

                    // Sign In Button
                    _isLoading
                        ? const Center(
                            child: CircularProgressIndicator(
                              color: AppColors.green,
                            ),
                          )
                        : SportsOSButton(
                            text: 'Sign In',
                            onPressed: _handleSignIn,
                          ).animate().fadeIn(delay: 600.ms),

                    const SizedBox(height: 24),

                    // Alternative Sign In
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: [
                        _buildSocialButton(Icons.apple, 'Apple', isDark),
                        _buildSocialButton(
                          Icons.fingerprint,
                          'Biometric',
                          isDark,
                        ),
                      ],
                    ).animate().fadeIn(delay: 700.ms),

                    const SizedBox(height: 40),

                    // Athlete Features Preview
                    Text(
                      'ATHLETE FEATURES',
                      style: TextStyle(
                        color:
                            isDark ? AppColors.textSecondary : Colors.black54,
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 1.2,
                      ),
                    ).animate().fadeIn(delay: 800.ms),
                    const SizedBox(height: 16),

                    SizedBox(
                      height: 100,
                      child: ListView(
                        scrollDirection: Axis.horizontal,
                        children: [
                          _buildFeatureCard(
                            'Track Performance',
                            Icons.trending_up,
                            AppColors.green,
                            isDark,
                          ),
                          _buildFeatureCard(
                            'View Schedules',
                            Icons.calendar_month,
                            AppColors.blue,
                            isDark,
                          ),
                          _buildFeatureCard(
                            'Join Tournaments',
                            Icons.emoji_events,
                            AppColors.amber,
                            isDark,
                          ),
                          _buildFeatureCard(
                            'Progress Reports',
                            Icons.analytics,
                            Colors.purpleAccent,
                            isDark,
                          ),
                        ],
                      ),
                    ).animate().fadeIn(delay: 900.ms).slideX(begin: 0.2),

                    const SizedBox(height: 40),

                    // Bottom Links
                    Center(
                      child: Column(
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Text(
                                'New Athlete?',
                                style: TextStyle(
                                  color: isDark
                                      ? AppColors.textSecondary
                                      : Colors.black54,
                                ),
                              ),
                              TextButton(
                                onPressed: () =>
                                    context.push('/register/Student'),
                                child: const Text('Create Account'),
                              ),
                            ],
                          ),
                          Text(
                            'By signing in, you agree to our Terms & Privacy Policy',
                            style: TextStyle(
                              color: isDark
                                  ? AppColors.textSecondary.withValues(
                                      alpha: 0.5,
                                    )
                                  : Colors.black38,
                              fontSize: 11,
                            ),
                          ),
                          const SizedBox(height: 16),
                          TextButton.icon(
                            onPressed: () => context.go('/home'),
                            icon: const Icon(Icons.explore, size: 18),
                            label: const Text('Explore the app as a guest'),
                            style: TextButton.styleFrom(
                              foregroundColor: isDark
                                  ? AppColors.textSecondary
                                  : Colors.black54,
                            ),
                          ),
                        ],
                      ),
                    ).animate().fadeIn(delay: 1000.ms),

                    const SizedBox(height: 24),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSocialButton(IconData icon, String label, bool isDark,
      {VoidCallback? onTap}) {
    return GestureDetector(
      onTap: onTap,
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: isDark ? AppColors.cardDark : Colors.white,
              borderRadius: BorderRadius.circular(16),
              border:
                  Border.all(color: isDark ? Colors.white12 : Colors.black12),
            ),
            child: Icon(
              icon,
              color: isDark ? AppColors.textPrimary : Colors.black87,
              size: 28,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            label,
            style: TextStyle(
              color: isDark ? AppColors.textSecondary : Colors.black54,
              fontSize: 11,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFeatureCard(
    String title,
    IconData icon,
    Color accentColor,
    bool isDark,
  ) {
    return Container(
      width: 120,
      margin: const EdgeInsets.only(right: 12),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: (isDark ? AppColors.cardDark : Colors.white).withValues(
          alpha: 0.7,
        ),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: accentColor.withValues(alpha: 0.3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, color: accentColor, size: 24),
          const Spacer(),
          Text(
            title,
            style: TextStyle(
              color: isDark ? AppColors.textPrimary : Colors.black87,
              fontSize: 12,
              fontWeight: FontWeight.bold,
              height: 1.2,
            ),
          ),
        ],
      ),
    );
  }
}
