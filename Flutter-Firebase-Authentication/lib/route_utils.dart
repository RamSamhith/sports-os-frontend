import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'auth_provider.dart';

void routeBasedOnRole(BuildContext context, WidgetRef ref) {
  final userState = ref.read(authStateProvider);
  final role = userState.value?.role;
  
  if (role == 'coach') {
    context.go('/coach_dashboard');
  } else if (role == 'academy') {
    context.go('/academy_dashboard');
  } else {
    context.go('/home');
  }
}
