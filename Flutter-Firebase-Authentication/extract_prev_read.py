import json
import os

path = r'C:\Users\kmabd\.gemini\antigravity\brain\479c8757-949d-43ce-b7e4-f0675322807a\.system_generated\logs\transcript_full.jsonl'

contents_read = {
    'sign_in_screen.dart': None,
    'parent_registration_screen.dart': None,
    'student_registration_screen.dart': None,
    'coach_registration_screen.dart': None
}

for line in open(path, 'r', encoding='utf-8'):
    try:
        data = json.loads(line)
        if data.get('type') == 'TOOL_RESPONSE':
            for res in data.get('tool_responses', []):
                out = res.get('output', '')
                for k in contents_read.keys():
                    if f'c:/Users/kmabd/myapp/lib/{k}' in out or f'c:\\Users\\kmabd\\myapp\\lib\\{k}' in out:
                        if 'Showing lines 1 to' in out and 'Total Lines:' in out:
                            # It's a view_file output. 
                            contents_read[k] = out
    except Exception as e:
        pass

for k, v in contents_read.items():
    if v:
        lines = []
        for l in v.split('\n'):
            if ': ' in l and l.split(': ')[0].isdigit():
                lines.append(l.split(': ', 1)[1])
        with open(f'lib/{k}', 'w', encoding='utf-8') as f:
            f.write('\n'.join(lines))
        print(f"Restored {k} from previous conversation's view_file output!")

