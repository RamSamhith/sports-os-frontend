import json
import os

path = r'C:\Users\kmabd\.gemini\antigravity\brain\bf626562-4ae5-498f-893c-9e2e4841f211\.system_generated\logs\transcript_full.jsonl'
files_to_recover = [
    'sign_in_screen.dart',
    'parent_registration_screen.dart',
    'student_registration_screen.dart',
    'coach_registration_screen.dart'
]

latest_contents = {f: None for f in files_to_recover}

for line in open(path, 'r', encoding='utf-8'):
    try:
        data = json.loads(line)
        # We need the glassmorphism files which were written around step 1550-1650.
        # But wait, earlier I saw write_to_file at 1803, 1809, 1815? NO! Those were me rewriting extract scripts!
        # The glassmorphism was written at 1557, 1616, etc.
        # So we MUST NOT break. We just need the last write_to_file BEFORE step 1660.
        step = data.get('step_index')
        if step > 1660:
            break
            
        if 'tool_calls' in data:
            for tc in data['tool_calls']:
                name = tc.get('name')
                if name in ['write_to_file']:
                    args = tc.get('arguments', {})
                    if isinstance(args, str):
                        try:
                            args = json.loads(args)
                        except:
                            pass
                    
                    if isinstance(args, dict):
                        target = args.get('TargetFile', '')
                        for k in files_to_recover:
                            if k in target:
                                latest_contents[k] = args.get('CodeContent', '')
    except Exception as e:
        pass

for k, v in latest_contents.items():
    if v:
        with open('lib/' + k, 'w', encoding='utf-8') as f:
            f.write(v)
        print(f"Recovered {k} from transcript!")
