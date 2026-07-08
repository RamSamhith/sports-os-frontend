import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class ApiService {
  // Use local IP for physical device testing on the same Wi-Fi network
  static const String baseUrl = 'https://cell-receives-challenging-factors.trycloudflare.com';
  
  final FlutterSecureStorage _storage = const FlutterSecureStorage();

  // Helper method to get the token
  Future<String?> getToken() async {
    return await _storage.read(key: 'jwt_token');
  }

  // Helper method to store the token directly
  Future<void> storeToken(String token) async {
    await _storage.write(key: 'jwt_token', value: token);
  }

  // Generic GET request
  Future<http.Response> get(String endpoint) async {
    final token = await getToken();
    return await http.get(
      Uri.parse('$baseUrl$endpoint'),
      headers: {
        'Content-Type': 'application/json',
        'Bypass-Tunnel-Reminder': 'true',
        if (token != null) 'Authorization': 'Bearer $token',
      },
    );
  }

  // Generic POST request
  Future<http.Response> post(String endpoint, Map<String, dynamic> body) async {
    final token = await getToken();
    return await http.post(
      Uri.parse('$baseUrl$endpoint'),
      headers: {
        'Content-Type': 'application/json',
        'Bypass-Tunnel-Reminder': 'true',
        if (token != null) 'Authorization': 'Bearer $token',
      },
      body: jsonEncode(body),
    );
  }

  Future<http.Response> put(String endpoint, Map<String, dynamic> body) async {
    final token = await getToken();
    return await http.put(
      Uri.parse('$baseUrl$endpoint'),
      headers: {
        'Content-Type': 'application/json',
        'Bypass-Tunnel-Reminder': 'true',
        if (token != null) 'Authorization': 'Bearer $token',
      },
      body: jsonEncode(body),
    );
  }

  // Handle Login and store token
  Future<Map<String, dynamic>> login(String email, String password) async {
    final response = await post('/auth/login', {
      'email': email,
      'password': password,
    });

    final jsonResponse = jsonDecode(response.body);
    if (response.statusCode == 200) {
      final responseData = jsonResponse['data'];
      await _storage.write(key: 'jwt_token', value: responseData['token']);
      return {'success': true, 'data': responseData};
    } else {
      final errorMsg = jsonResponse['error'] != null ? jsonResponse['error']['message'] : 'Login failed';
      return {'success': false, 'error': errorMsg};
    }
  }

  // Handle Signup
  Future<Map<String, dynamic>> signup(Map<String, dynamic> userData) async {
    final response = await post('/auth/register', userData);
    final jsonResponse = jsonDecode(response.body);
    
    if (response.statusCode == 201) {
      final responseData = jsonResponse['data'];
      if (responseData['token'] != null) {
        await _storage.write(key: 'jwt_token', value: responseData['token']);
      }
      return {'success': true, 'data': responseData};
    } else {
      final errorMsg = jsonResponse['error'] != null ? jsonResponse['error']['message'] : 'Signup failed';
      return {'success': false, 'error': errorMsg};
    }
  }

  Future<void> logout() async {
    await _storage.delete(key: 'jwt_token');
  }

  // Handle Profile Update
  Future<Map<String, dynamic>> updateProfile(Map<String, dynamic> data) async {
    final response = await put('/auth/profile', data);
    final jsonResponse = jsonDecode(response.body);
    
    if (response.statusCode == 200) {
      return {'success': true, 'data': jsonResponse['data']};
    } else {
      final errorMsg = jsonResponse['error'] != null ? jsonResponse['error']['message'] : 'Update failed';
      return {'success': false, 'error': errorMsg};
    }
  }

  // Get Academies
  Future<Map<String, dynamic>> getAcademies() async {
    final response = await get('/academies?pageSize=100');
    final jsonResponse = jsonDecode(response.body);
    if (response.statusCode == 200) {
      return {'success': true, 'data': jsonResponse['data']};
    }
    return {'success': false};
  }

  // Get Sports
  Future<Map<String, dynamic>> getSports() async {
    final response = await get('/sports');
    final jsonResponse = jsonDecode(response.body);
    if (response.statusCode == 200) {
      return {'success': true, 'data': jsonResponse['data']};
    }
    return {'success': false};
  }

  // Submit Enquiry
  Future<Map<String, dynamic>> submitEnquiry(Map<String, dynamic> data) async {
    final response = await post('/enquiries', data);
    final jsonResponse = jsonDecode(response.body);
    if (response.statusCode == 201 || response.statusCode == 200) {
      return {'success': true, 'data': jsonResponse['data'] ?? jsonResponse};
    } else {
      final errorMsg = jsonResponse['error'] != null 
          ? (jsonResponse['error'] is String ? jsonResponse['error'] : jsonResponse['error']['message'] ?? 'Submission failed') 
          : 'Submission failed';
      return {'success': false, 'error': errorMsg};
    }
  }
}
