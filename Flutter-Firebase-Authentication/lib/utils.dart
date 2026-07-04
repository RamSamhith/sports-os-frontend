import 'dart:convert';
import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

ImageProvider? getProfileImageProvider(String? photoURL) {
  if (photoURL == null || photoURL.isEmpty) return null;
  
  if (photoURL.startsWith('data:image')) {
    final base64String = photoURL.split(',').last;
    return MemoryImage(base64Decode(base64String));
  }
  
  if (kIsWeb || photoURL.startsWith('http')) {
    return NetworkImage(photoURL);
  } else {
    return FileImage(File(photoURL));
  }
}
