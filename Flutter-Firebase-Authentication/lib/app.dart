import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'theme.dart';
import 'app_router.dart';

class SportsOSApp extends ConsumerWidget {
  const SportsOSApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(appRouterProvider);
    final themeMode = ref.watch(themeProvider);

    return MaterialApp.router(
      title: 'Sports OS',
      debugShowCheckedModeBanner: false,

      themeMode: themeMode,
      theme: SportsOSTheme.light(),
      darkTheme: SportsOSTheme.dark(),

      routerConfig: router,
    );
  }
}
