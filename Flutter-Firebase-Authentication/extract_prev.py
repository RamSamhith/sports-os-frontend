import json
import os

path = r'C:\Users\kmabd\.gemini\antigravity\brain\479c8757-949d-43ce-b7e4-f0675322807a\.system_generated\logs\transcript_full.jsonl'

contents = {
    'sign_in_screen.dart': None,
    'parent_registration_screen.dart': None,
    'student_registration_screen.dart': None,
    'coach_registration_screen.dart': None
}

for line in open(path, 'r', encoding='utf-8'):
    try:
        data = json.loads(line)
        if 'tool_calls' in data:
            for tc in data['tool_calls']:
                name = tc.get('name')
                if name == 'write_to_file':
                    args = tc.get('arguments', {})
                    if isinstance(args, str):
                        try:
                            args = json.loads(args)
                        except:
                            pass
                    if isinstance(args, dict):
                        target = args.get('TargetFile', '')
                        for k in contents.keys():
                            if k in target:
                                contents[k] = args.get('CodeContent', '')
    except Exception as e:
        pass

for k, v in contents.items():
    if v:
        with open(f'lib/{k}', 'w', encoding='utf-8') as f:
            f.write(v)
        print(f"Restored {k} from previous conversation!")
