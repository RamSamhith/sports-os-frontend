import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'coach_dashboard_screen.dart';
import 'academy_dashboard_screen.dart';
import 'welcome_screen.dart';
import 'role_select_screen.dart';
import 'sign_in_screen.dart';
import 'parent_registration_screen.dart';
import 'home_screen.dart';
import 'comparison_screen.dart';
import 'student_sign_in_screen.dart';
import 'coach_sign_in_screen.dart';
import 'coach_registration_screen.dart';
import 'coach_registration_screen.dart';
import 'student_registration_screen.dart';
import 'location_screen.dart'; // Import the new location screen
import 'otp_signin_screen.dart';
import 'academies_search_screen.dart';
import 'academy_details_screen.dart';
import 'sports_details_screen.dart';
import 'edit_profile_screen.dart';
import 'notifications_screen.dart';
import 'city_page_screen.dart';
import 'forgot_password_screen.dart';
import 'reset_password_screen.dart';
import 'settings_screen.dart';
import 'enquire_screen.dart';


final appRouterProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: '/welcome',
    // The error builder catches broken routes so your app doesn't crash
    errorBuilder: (context, state) => Scaffold(
      appBar: AppBar(title: const Text('Error')),
      body: Center(child: Text('Page not found: ${state.uri.toString()}')),
    ),
    routes: [
      GoRoute(
        path: '/welcome',
        builder: (context, state) => const WelcomeScreen(),
      ),
      GoRoute(
        path: '/coach_dashboard',
        builder: (context, state) => const CoachDashboardScreen(),
      ),
      GoRoute(
        path: '/academy_dashboard',
        builder: (context, state) => const AcademyDashboardScreen(),
      ),
      GoRoute(
        path: '/role',
        builder: (context, state) => const RoleSelectScreen(),
      ),
      GoRoute(
        path: '/signin',
        builder: (context, state) => const SignInScreen(),
      ),
      GoRoute(
        path: '/edit_profile',
        builder: (context, state) => const EditProfileScreen(),
      ),
      GoRoute(
        path: '/settings',
        builder: (context, state) => const SettingsScreen(),
      ),
      GoRoute(
        path: '/otp_signin',
        builder: (context, state) => const OtpSignInScreen(),
      ),
      GoRoute(
        path: '/student_signin',
        builder: (context, state) => const StudentSignInScreen(),
      ),
      GoRoute(
        path: '/coach_signin',
        builder: (context, state) => const CoachSignInScreen(),
      ),
      GoRoute(
        path: '/forgot_password',
        builder: (context, state) => const ForgotPasswordScreen(),
      ),
      GoRoute(
        path: '/reset-password',
        builder: (context, state) {
          final token = state.uri.queryParameters['token'] ?? '';
          return ResetPasswordScreen(token: token);
        },
      ),
      GoRoute(
        path: '/register/:role',
        builder: (context, state) {
          final role = state.pathParameters['role'] ?? 'Parent';

          if (role == 'Parent') {
            return ParentRegistrationScreen(role: role);
          }

          if (role == 'Coach') {
            return const CoachRegistrationScreen();
          }

          if (role == 'Athlete') {
            return StudentRegistrationScreen(role: role);
          }

          return Scaffold(
            appBar: AppBar(title: Text('$role Setup')),
            body: Center(child: Text('$role registration coming soon!')),
          );
        },
      ),
      GoRoute(path: '/home', builder: (context, state) => const HomeScreen()),
      GoRoute(
        path: '/compare',
        builder: (context, state) => const ComparisonScreen(),
      ),
      GoRoute(
        path: '/location', // Define a path for the LocationScreen
        builder: (context, state) => const LocationScreen(),
      ),
      GoRoute(
        path: '/academies_search',
        builder: (context, state) => const AcademiesSearchScreen(),
      ),
      GoRoute(
        path: '/academy_details/:id',
        builder: (context, state) {
          final id = state.pathParameters['id'] ?? '1';
          return AcademyDetailsScreen(academyId: id);
        },
      ),
      GoRoute(
        path: '/academy_details/:id/enquire',
        builder: (context, state) {
          final id = state.pathParameters['id'] ?? '1';
          return EnquireScreen(academyId: id);
        },
      ),
      GoRoute(
        path: '/sport_details/:id',
        builder: (context, state) {
          final id = state.pathParameters['id'] ?? 'cricket';
          return SportsDetailsScreen(sportId: id);
        },
      ),
      GoRoute(
        path: '/notifications',
        builder: (context, state) => const NotificationsScreen(),
      ),
      GoRoute(
        path: '/city/:cityName',
        builder: (context, state) {
          final cityName = state.pathParameters['cityName'] ?? 'Madanapalle';
          return CityPageScreen(cityName: cityName);
        },
      ),
    ],
  );
});
