import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'colors.dart';
import 'theme.dart';
import 'sports_os_button.dart';

class CoachSignInScreen extends ConsumerStatefulWidget {
  const CoachSignInScreen({super.key});

  @override
  ConsumerState<CoachSignInScreen> createState() => _CoachSignInScreenState();
}

class _CoachSignInScreenState extends ConsumerState<CoachSignInScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _academyController = TextEditingController();
  final _coachIdController = TextEditingController();
  bool _obscurePassword = true;
  bool _rememberMe = false;
  bool _isLoading = false;
  String? _errorMessage;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    _academyController.dispose();
    _coachIdController.dispose();
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
        // Navigate to the coach dashboard
        context.go('/coach_dashboard');
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
            child:
                Container(
                      width: 300,
                      height: 300,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: AppColors.blue.withValues(
                          alpha: isDark ? 0.15 : 0.05,
                        ),
                      ),
                    )
                    .animate(onPlay: (c) => c.repeat(reverse: true))
                    .blurXY(end: 80)
                    .scaleXY(end: 1.2, duration: 4.seconds),
          ),
          Positioned(
            bottom: 100,
            left: -100,
            child:
                Container(
                      width: 250,
                      height: 250,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: AppColors.green.withValues(
                          alpha: isDark ? 0.1 : 0.05,
                        ),
                      ),
                    )
                    .animate(onPlay: (c) => c.repeat(reverse: true))
                    .blurXY(end: 80)
                    .scaleXY(end: 1.2, duration: 5.seconds),
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
                      'COACH\nLOGIN',
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
                      'Manage your academy professionally.',
                      style: TextStyle(
                        fontSize: 16,
                        color: isDark
                            ? AppColors.textSecondary
                            : Colors.black87,
                        height: 1.5,
                      ),
                    ).animate().fadeIn(delay: 200.ms),
                    const SizedBox(height: 32),

                    // Verification Status Widget
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: (isDark ? AppColors.cardDark : Colors.white)
                            .withValues(alpha: 0.7),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(
                          color: AppColors.blue.withValues(alpha: 0.3),
                        ),
                      ),
                      child: Row(
                        children: [
                          const Icon(
                            Icons.verified,
                            color: AppColors.blue,
                            size: 32,
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'Verification Status',
                                  style: TextStyle(
                                    color: isDark
                                        ? AppColors.textSecondary
                                        : Colors.black54,
                                    fontSize: 12,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Row(
                                  children: [
                                    const Text(
                                      'Verified Coach',
                                      style: TextStyle(
                                        color: AppColors.blue,
                                        fontWeight: FontWeight.bold,
                                        fontSize: 16,
                                      ),
                                    ),
                                    const SizedBox(width: 8),
                                    Container(
                                      padding: const EdgeInsets.symmetric(
                                        horizontal: 8,
                                        vertical: 2,
                                      ),
                                      decoration: BoxDecoration(
                                        color: AppColors.blue.withValues(
                                          alpha: 0.2,
                                        ),
                                        borderRadius: BorderRadius.circular(8),
                                      ),
                                      child: const Text(
                                        '100%',
                                        style: TextStyle(
                                          color: AppColors.blue,
                                          fontSize: 10,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ).animate().fadeIn(delay: 300.ms).slideY(begin: 0.1),

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

                    // Login Fields
                    _buildTextField(
                      controller: _emailController,
                      label: 'Registered Email',
                      icon: Icons.email_outlined,
                      isDark: isDark,
                      delay: 400,
                    ),
                    _buildTextField(
                      controller: _passwordController,
                      label: 'Password',
                      icon: Icons.lock_outline,
                      isDark: isDark,
                      isPassword: true,
                      delay: 450,
                    ),
                    _buildTextField(
                      controller: _academyController,
                      label: 'Academy Name',
                      icon: Icons.business_outlined,
                      isDark: isDark,
                      delay: 500,
                    ),
                    _buildTextField(
                      controller: _coachIdController,
                      label: 'Coach ID (Optional)',
                      icon: Icons.badge_outlined,
                      isDark: isDark,
                      isOptional: true,
                      delay: 550,
                    ),

                    const SizedBox(height: 12),

                    // Security Options
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
                              'Remember device',
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
                    ).animate().fadeIn(delay: 600.ms),

                    const SizedBox(height: 24),

                    // Sign In Button
                    _isLoading
                        ? const Center(
                            child: CircularProgressIndicator(
                              color: AppColors.green,
                            ),
                          )
                        : SportsOSButton(
                            text: 'Login',
                            onPressed: _handleSignIn,
                          ).animate().fadeIn(delay: 650.ms),

                    const SizedBox(height: 20),

                    // Biometric / 2FA
                    Center(
                      child: OutlinedButton.icon(
                        icon: const Icon(Icons.fingerprint, size: 24),
                        label: const Text('Sign in with Biometric'),
                        style: OutlinedButton.styleFrom(
                          minimumSize: const Size(double.infinity, 50),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(14),
                          ),
                          side: BorderSide(
                            color: isDark ? Colors.white24 : Colors.black12,
                          ),
                          foregroundColor: isDark
                              ? AppColors.textPrimary
                              : AppColors.textLight,
                        ),
                        onPressed: () {},
                      ),
                    ).animate().fadeIn(delay: 700.ms),

                    const SizedBox(height: 40),

                    // Stats Preview
                    Text(
                      'QUICK STATS PREVIEW',
                      style: TextStyle(
                        color: isDark
                            ? AppColors.textSecondary
                            : Colors.black54,
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 1.2,
                      ),
                    ).animate().fadeIn(delay: 800.ms),
                    const SizedBox(height: 16),

                    GridView.count(
                      crossAxisCount: 2,
                      crossAxisSpacing: 12,
                      mainAxisSpacing: 12,
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      childAspectRatio: 1.5,
                      children: [
                        _buildStatCard(
                          'Total Students',
                          '142',
                          Icons.groups,
                          AppColors.blue,
                          isDark,
                        ),
                        _buildStatCard(
                          'Academy Rating',
                          '4.8',
                          Icons.star,
                          AppColors.amber,
                          isDark,
                        ),
                        _buildStatCard(
                          'Upcoming Batches',
                          '3',
                          Icons.schedule,
                          AppColors.green,
                          isDark,
                        ),
                        _buildStatCard(
                          'Attendance Avg',
                          '92%',
                          Icons.check_circle_outline,
                          Colors.purpleAccent,
                          isDark,
                        ),
                      ],
                    ).animate().fadeIn(delay: 850.ms).slideY(begin: 0.1),

                    const SizedBox(height: 40),

                    // Bottom Info
                    Center(
                      child: Column(
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Text(
                                'Not a registered coach?',
                                style: TextStyle(
                                  color: isDark
                                      ? AppColors.textSecondary
                                      : Colors.black54,
                                ),
                              ),
                              TextButton(
                                onPressed: () =>
                                    context.push('/register/Coach'),
                                child: const Text('Register as Coach'),
                              ),
                            ],
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 16,
                              vertical: 8,
                            ),
                            decoration: BoxDecoration(
                              color: AppColors.amber.withValues(alpha: 0.1),
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(
                                color: AppColors.amber.withValues(alpha: 0.3),
                              ),
                            ),
                            child: const Text(
                              'Only verified coaches can access full dashboard',
                              style: TextStyle(
                                color: AppColors.amber,
                                fontSize: 11,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                          const SizedBox(height: 12),
                          Text(
                            'Sports OS Verification Notice',
                            style: TextStyle(
                              color: isDark
                                  ? AppColors.textSecondary.withValues(
                                      alpha: 0.5,
                                    )
                                  : Colors.black38,
                              fontSize: 11,
                            ),
                          ),
                        ],
                      ),
                    ).animate().fadeIn(delay: 900.ms),

                    const SizedBox(height: 32),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String label,
    required IconData icon,
    required bool isDark,
    required int delay,
    bool isPassword = false,
    bool isOptional = false,
  }) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16.0),
      child: TextFormField(
        controller: controller,
        obscureText: isPassword ? _obscurePassword : false,
        style: TextStyle(
          color: isDark ? AppColors.textPrimary : Colors.black87,
        ),
        decoration: InputDecoration(
          labelText: label,
          prefixIcon: Icon(icon),
          suffixIcon: isPassword
              ? IconButton(
                  icon: Icon(
                    _obscurePassword ? Icons.visibility_off : Icons.visibility,
                  ),
                  onPressed: () =>
                      setState(() => _obscurePassword = !_obscurePassword),
                )
              : null,
          border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
        ),
        validator: (value) {
          if (!isOptional && (value == null || value.isEmpty)) {
            return 'Required field';
          }
          return null;
        },
      ).animate().fadeIn(delay: delay.ms).slideY(begin: 0.1),
    );
  }

  Widget _buildStatCard(
    String title,
    String value,
    IconData icon,
    Color accentColor,
    bool isDark,
  ) {
    return Container(
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
          Row(
            children: [
              Icon(icon, color: accentColor, size: 20),
              const Spacer(),
              Text(
                value,
                style: TextStyle(
                  color: isDark ? AppColors.textPrimary : Colors.black87,
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          const Spacer(),
          Text(
            title,
            style: TextStyle(
              color: isDark ? AppColors.textSecondary : Colors.black54,
              fontSize: 12,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }
}
