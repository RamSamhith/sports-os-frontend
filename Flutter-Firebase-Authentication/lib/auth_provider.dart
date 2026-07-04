import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'auth_service.dart';

final isGuestProvider = StateProvider<bool>((ref) => true);

class AuthStateNotifier extends Notifier<AsyncValue<User?>> {
  final AuthService _authService = AuthService();
  StreamSubscription<User?>? _authStateSubscription;

  @override
  AsyncValue<User?> build() {
    _authStateSubscription?.cancel();
    _authStateSubscription = _authService.authStateChanges.listen((User? user) {
      _handleUserChange(user);
    });
    
    // Kick off initialization to fetch current user token & profile
    Future.microtask(() => _authService.init());
    
    return const AsyncValue.loading();
  }

  void _handleUserChange(User? user) {
    if (user == null) {
      state = const AsyncValue.data(null);
      ref.read(isGuestProvider.notifier).state = true;
    } else {
      state = AsyncValue.data(user);
      ref.read(isGuestProvider.notifier).state = false;
    }
  }

  Future<void> registerWithEmail(String email, String password, String role, Map<String, dynamic> extraData) async {
    state = const AsyncValue.loading();
    try {
      final res = await _authService.registerWithEmail(email, password, role: role, extraData: extraData);
      if (!res['success']) {
        throw Exception(res['error']);
      }
      state = AsyncValue.data(_authService.currentUser);
    } catch (e) {
      state = const AsyncValue.data(null);
      rethrow;
    }
  }

  Future<void> loginWithEmail(String email, String password) async {
    state = const AsyncValue.loading();
    try {
      final res = await _authService.loginWithEmail(email, password);
      if (!res['success']) {
        throw Exception(res['error']);
      }
      state = AsyncValue.data(_authService.currentUser);
    } catch (e) {
      state = const AsyncValue.data(null);
      rethrow;
    }
  }

  Future<void> loginWithGoogle() async {
    state = const AsyncValue.loading();
    try {
      final res = await _authService.loginWithGoogle();
      if (!res['success']) {
        throw Exception(res['error']);
      }
      // state changes handled by stream listener
    } catch (e) {
      state = const AsyncValue.data(null);
      rethrow;
    }
  }

  Future<void> loginWithMicrosoft() async {
    state = const AsyncValue.loading();
    try {
      final res = await _authService.loginWithMicrosoft();
      if (!res['success']) {
        throw Exception(res['error']);
      }
      // state changes handled by stream listener
    } catch (e) {
      state = const AsyncValue.data(null);
      rethrow;
    }
  }

  Future<void> verifyOtp(String phone, String otp) async {
    state = const AsyncValue.loading();
    try {
      final res = await _authService.verifyOtp(phone, otp);
      if (!res['success']) {
        throw Exception(res['error']);
      }
      // state changes handled by stream listener
    } catch (e) {
      state = const AsyncValue.data(null);
      rethrow;
    }
  }

  Future<String> resetPassword(String email) async {
    return await _authService.sendPasswordResetEmail(email);
  }

  Future<String> confirmPasswordReset(String token, String password) async {
    return await _authService.confirmPasswordReset(token, password);
  }

  Future<void> updateProfilePhoto(String base64String) async {
    final res = await _authService.updateProfile({'avatar': base64String});
    if (!res['success']) {
      throw Exception(res['error']);
    }
  }

  Future<void> updateProfile({required String name, required String email, required String phone}) async {
    final res = await _authService.updateProfile({
      'name': name,
      // email update might require a separate route, but let's pass it for now or omit if backend doesn't handle it in /profile
      'phone': phone,
    });
    if (!res['success']) {
      throw Exception(res['error']);
    }
  }

  Future<void> signOut() async {
    await _authService.logout();
    // stream listener will set state to null
  }
}

final authStateProvider = NotifierProvider<AuthStateNotifier, AsyncValue<User?>>(() {
  return AuthStateNotifier();
});

final authControllerProvider = Provider<AuthStateNotifier>((ref) {
  return ref.watch(authStateProvider.notifier);
});
