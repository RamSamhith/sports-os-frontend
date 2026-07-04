import 'package:flutter/material.dart';
import 'route_utils.dart';
import 'auth_provider.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'theme.dart';
import 'colors.dart';

class OtpSignInScreen extends ConsumerStatefulWidget {
  const OtpSignInScreen({super.key});

  @override
  ConsumerState<OtpSignInScreen> createState() => _OtpSignInScreenState();
}

class _OtpSignInScreenState extends ConsumerState<OtpSignInScreen> {
  final _phoneController = TextEditingController();
  final _otpController = TextEditingController();
  bool _otpSent = false;

  void _sendOtp() {
    if (_phoneController.text.isNotEmpty) {
      setState(() {
        _otpSent = true;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('OTP Sent! (Mock)')),
      );
    }
  }

  void _verifyOtp() async {
    if (_otpController.text.isNotEmpty) {
      try {
        await ref.read(authControllerProvider).verifyOtp(
          _phoneController.text,
          _otpController.text,
        );
        if (mounted) routeBasedOnRole(context, ref);
      } catch (e) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Invalid OTP. Hint: Use 123456')),
          );
        }
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = ref.watch(themeProvider) == ThemeMode.dark;

    return Container(
      decoration: BoxDecoration(
        gradient: isDark ? AppColors.darkGradient : AppColors.lightGradient,
      ),
      child: Scaffold(
        backgroundColor: Colors.transparent,
        appBar: AppBar(
          title: const Text('OTP Sign In'),
          backgroundColor: Colors.transparent,
          elevation: 0,
        ),
        body: SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                if (!_otpSent) ...[
                  TextField(
                    controller: _phoneController,
                    decoration: const InputDecoration(
                      labelText: 'Phone Number',
                      border: OutlineInputBorder(),
                    ),
                  ),
                  const SizedBox(height: 20),
                  ElevatedButton(
                    onPressed: _sendOtp,
                    child: const Text('Send OTP'),
                  ),
                ] else ...[
                  TextField(
                    controller: _otpController,
                    decoration: const InputDecoration(
                      labelText: 'Enter OTP',
                      border: OutlineInputBorder(),
                    ),
                  ),
                  const SizedBox(height: 20),
                  ElevatedButton(
                    onPressed: _verifyOtp,
                    child: const Text('Verify OTP'),
                  ),
                ],
              ],
            ),
          ),
        ),
      ),
    );
  }
}

