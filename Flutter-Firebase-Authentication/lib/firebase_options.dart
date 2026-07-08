import 'package:firebase_core/firebase_core.dart' show FirebaseOptions;
import 'package:flutter/foundation.dart'
    show defaultTargetPlatform, kIsWeb, TargetPlatform;

/// Default [FirebaseOptions] for use with your Firebase apps.
class DefaultFirebaseOptions {
  static FirebaseOptions get currentPlatform {
    if (kIsWeb) {
      return web;
    }
    switch (defaultTargetPlatform) {
      case TargetPlatform.android:
        return const FirebaseOptions(
          apiKey: 'AIzaSyByzk3qTuzaSFkZ3hkRkf5fKKQ3IoWgpaU',
          appId: '1:856695819338:android:417dc53eb43b515ed92ab3',
          messagingSenderId: '856695819338',
          projectId: 'sportsos-64168',
          storageBucket: 'sportsos-64168.firebasestorage.app',
        );
      case TargetPlatform.iOS:
        throw UnsupportedError(
          'DefaultFirebaseOptions have not been configured for ios - '
          'you can reconfigure this by running the FlutterFire CLI again.',
        );
      case TargetPlatform.macOS:
        throw UnsupportedError(
          'DefaultFirebaseOptions have not been configured for macos - '
          'you can reconfigure this by running the FlutterFire CLI again.',
        );
      case TargetPlatform.windows:
        throw UnsupportedError(
          'DefaultFirebaseOptions have not been configured for windows - '
          'you can reconfigure this by running the FlutterFire CLI again.',
        );
      case TargetPlatform.linux:
        throw UnsupportedError(
          'DefaultFirebaseOptions have not been configured for linux - '
          'you can reconfigure this by running the FlutterFire CLI again.',
        );
      default:
        throw UnsupportedError(
          'DefaultFirebaseOptions are not supported for this platform.',
        );
    }
  }

  static const FirebaseOptions web = FirebaseOptions(
    apiKey: 'AIzaSyAV_0tS_4U6GZmPpFVuu2tl5J4WKuS5yBc',
    appId: '1:856695819338:web:dff339d48f586d5fd92ab3',
    messagingSenderId: '856695819338',
    projectId: 'sportsos-64168',
    authDomain: 'sportsos-64168.firebaseapp.com',
    storageBucket: 'sportsos-64168.firebasestorage.app',
    measurementId: 'G-DCH64WMP57',
  );
}
