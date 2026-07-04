import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'shared_prefs_provider.dart';
import 'auth_provider.dart';
class ShortlistState {
  final Set<String> academyIds;
  final Set<String> coachIds;
  final bool isSyncing;

  ShortlistState({
    required this.academyIds,
    required this.coachIds,
    this.isSyncing = false,
  });

  ShortlistState copyWith({
    Set<String>? academyIds,
    Set<String>? coachIds,
    bool? isSyncing,
  }) {
    return ShortlistState(
      academyIds: academyIds ?? this.academyIds,
      coachIds: coachIds ?? this.coachIds,
      isSyncing: isSyncing ?? this.isSyncing,
    );
  }
}

class ShortlistNotifier extends StateNotifier<ShortlistState> {
  final SharedPreferences prefs;
  final String? uid;
  
  static const _academiesKey = 'shortlist_academies';
  static const _coachesKey = 'shortlist_coaches';

  ShortlistNotifier(this.prefs, this.uid) : super(ShortlistState(academyIds: {}, coachIds: {})) {
    _init();
  }

  Future<void> _init() async {
    _loadFromPrefs();
    if (uid != null) {
      await _syncWithCloud();
    }
  }

  void _loadFromPrefs() {
    final academyList = prefs.getStringList(_academiesKey) ?? [];
    final coachList = prefs.getStringList(_coachesKey) ?? [];
    state = state.copyWith(
      academyIds: academyList.toSet(),
      coachIds: coachList.toSet(),
    );
  }

  Future<void> _saveToPrefs() async {
    await prefs.setStringList(_academiesKey, state.academyIds.toList());
    await prefs.setStringList(_coachesKey, state.coachIds.toList());
  }

  Future<void> _saveToCloud() async {
    // Stub
  }

  void toggleAcademy(String id) {
    final updated = Set<String>.from(state.academyIds);
    if (updated.contains(id)) {
      updated.remove(id);
    } else {
      updated.add(id);
    }
    state = state.copyWith(academyIds: updated);
    _saveToPrefs();
    _saveToCloud();
  }

  void toggleCoach(String id) {
    final updated = Set<String>.from(state.coachIds);
    if (updated.contains(id)) {
      updated.remove(id);
    } else {
      updated.add(id);
    }
    state = state.copyWith(coachIds: updated);
    _saveToPrefs();
    _saveToCloud();
  }

  void clearSelection() {
    state = state.copyWith(academyIds: {}, coachIds: {});
    _saveToPrefs();
    _saveToCloud();
  }

  Future<void> _syncWithCloud() async {
    // Stub
  }
}

final shortlistProvider = StateNotifierProvider<ShortlistNotifier, ShortlistState>((ref) {
  final prefs = ref.watch(sharedPreferencesProvider);
  final authState = ref.watch(authStateProvider);
  final uid = authState.value?.uid;
  return ShortlistNotifier(prefs, uid);
});
