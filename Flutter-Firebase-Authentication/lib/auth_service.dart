import 'dart:async';
import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'api_service.dart';

class User {
  final String id;
  final String email;
  final String role;
  final String? displayName;
  final String? photoURL;
  final String? phoneNumber;

  // alias for backward compatibility
  String get uid => id;
  
  User({
    required this.id, 
    required this.email, 
    required this.role,
    this.displayName,
    this.photoURL,
    this.phoneNumber,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] ?? json['_id'] ?? '',
      email: json['email'] ?? '',
      role: json['role'] ?? 'user',
      displayName: json['displayName'] ?? json['name'],
      photoURL: json['photoURL'] ?? json['avatar'],
      phoneNumber: json['phoneNumber'] ?? json['phone'],
    );
  }
}

class AuthService {
  final ApiService _api = ApiService();
  User? _currentUser;
  
  // A simple broadcast stream to notify listeners of auth changes
  final _authStateController = StreamController<User?>.broadcast();

  AuthService();

  // Get current user stream
  Stream<User?> get authStateChanges => _authStateController.stream;

  User? get currentUser => _currentUser;

  Future<void> init() async {
    final token = await _api.getToken();
    if (token != null) {
      try {
        final res = await _api.get('/auth/me');
        if (res.statusCode == 200) {
          final jsonResponse = jsonDecode(res.body);
          if (jsonResponse['ok'] == true && jsonResponse['data'] != null) {
            _currentUser = User.fromJson(jsonResponse['data']);
            _authStateController.add(_currentUser);
            return;
          }
        }
      } catch (e) {
        // Token might be invalid or network error, let it fall through to null
        debugPrint('AuthService init error: $e');
      }
    }
    _currentUser = null;
    _authStateController.add(null);
  }

  Future<Map<String, dynamic>> loginWithEmail(String email, String password) async {
    try {
      final res = await _api.login(email, password);
      if (res['success']) {
        _currentUser = User.fromJson(res['data']['user']);
        _authStateController.add(_currentUser);
        return {'success': true};
      }
      return {'success': false, 'error': res['error']};
    } catch (e) {
      return {'success': false, 'error': e.toString()};
    }
  }

  Future<Map<String, dynamic>> registerWithEmail(String email, String password, {String role = 'user', Map<String, dynamic>? extraData}) async {
    try {
      final res = await _api.signup({
        'email': email,
        'password': password,
        'role': role,
        if (extraData != null) ...extraData,
      });
      if (res['success']) {
        _currentUser = User.fromJson(res['data']['user']);
        _authStateController.add(_currentUser);
        return {'success': true};
      }
      return {'success': false, 'error': res['error']};
    } catch (e) {
      return {'success': false, 'error': e.toString()};
    }
  }

  Future<Map<String, dynamic>> loginWithGoogle() async {
    try {
      final GoogleSignIn googleSignIn = GoogleSignIn(
        clientId: kIsWeb ? '856695819338-hjarh6dpbpoueoaa9ulimgkko9oapi6p.apps.googleusercontent.com' : null,
        serverClientId: kIsWeb ? null : '856695819338-hjarh6dpbpoueoaa9ulimgkko9oapi6p.apps.googleusercontent.com',
      );
      final GoogleSignInAccount? googleUser = await googleSignIn.signIn();
      if (googleUser == null) return {'success': false, 'error': 'Canceled by user'};

      final GoogleSignInAuthentication googleAuth = await googleUser.authentication;
      
      // Send the token to the backend for verification
      final res = await _api.post('/auth/google', {
        'idToken': googleAuth.idToken,
        'accessToken': googleAuth.accessToken,
      });
      
      final jsonResponse = jsonDecode(res.body);
      if (res.statusCode == 200 || res.statusCode == 201) {
        // The backend wraps successful responses in an { ok: true, data: { token, user } } object
        final data = jsonResponse['data'];
        final token = data['token'];
        
        if (token != null) {
          await _api.storeToken(token);
        }
        
        if (data['user'] != null) {
          _currentUser = User.fromJson(data['user']);
          _authStateController.add(_currentUser);
        }
        
        return {'success': true};
      }
      return {'success': false, 'error': jsonResponse['error']?['message'] ?? 'Google auth failed'};
    } catch (e) {
      return {'success': false, 'error': e.toString()};
    }
  }

  Future<Map<String, dynamic>> loginWithMicrosoft() async {
    // Stub for Microsoft login
    return {'success': false, 'error': 'Microsoft login not implemented on backend yet'};
  }

  Future<Map<String, dynamic>> verifyOtp(String phone, String otp) async {
    // Stub for OTP login
    return {'success': false, 'error': 'OTP login not implemented on backend yet'};
  }

  Future<String> sendPasswordResetEmail(String email) async {
    final res = await _api.post('/auth/forgot-password', {'email': email});
    final jsonResponse = jsonDecode(res.body);
    if (res.statusCode == 200 || res.statusCode == 201) {
      return jsonResponse['data']?['message'] ?? 'Password sent successfully';
    } else {
      throw Exception(jsonResponse['error']?['message'] ?? 'Failed to reset password');
    }
  }

  Future<String> confirmPasswordReset(String token, String password) async {
    final res = await _api.post('/auth/reset-password', {
      'token': token,
      'password': password,
    });
    final jsonResponse = jsonDecode(res.body);
    if (res.statusCode == 200 || res.statusCode == 201) {
      return jsonResponse['data']?['message'] ?? 'Password reset successfully';
    } else {
      throw Exception(jsonResponse['error']?['message'] ?? 'Failed to reset password');
    }
  }

  Future<void> logout() async {
    await _api.logout();
    _currentUser = null;
    _authStateController.add(null);
  }
  Future<Map<String, dynamic>> updateProfile(Map<String, dynamic> data) async {
    try {
      final res = await _api.updateProfile(data);
      if (res['success']) {
        _currentUser = User.fromJson(res['data']['user']);
        _authStateController.add(_currentUser);
        return {'success': true};
      }
      return {'success': false, 'error': res['error']};
    } catch (e) {
      return {'success': false, 'error': e.toString()};
    }
  }
}

