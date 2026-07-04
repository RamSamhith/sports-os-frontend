import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'shared_prefs_provider.dart';

class CompareNotifier extends StateNotifier<Set<String>> {
  final SharedPreferences prefs;
  static const _key = 'compare_list';

  CompareNotifier(this.prefs) : super({}) {
    _loadFromPrefs();
  }

  void _loadFromPrefs() {
    final list = prefs.getStringList(_key);
    if (list != null) {
      state = list.toSet();
    }
  }

  void _saveToPrefs() {
    prefs.setStringList(_key, state.toList());
  }

  void toggleSelection(String id) {
    if (state.contains(id)) {
      state = {...state}..remove(id);
    } else {
      state = {...state, id};
    }
    _saveToPrefs();
  }

  void clearSelection() {
    state = {};
    _saveToPrefs();
  }
}

final compareProvider = StateNotifierProvider<CompareNotifier, Set<String>>((ref) {
  final prefs = ref.watch(sharedPreferencesProvider);
  return CompareNotifier(prefs);
});
