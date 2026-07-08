import json
import os

path = r'C:\Users\kmabd\.gemini\antigravity\brain\bf626562-4ae5-498f-893c-9e2e4841f211\.system_generated\logs\transcript_full.jsonl'

# We want the content from before step 1500 (before wizards)
# Specifically, we want the LAST time the file was modified BEFORE step 1500.

contents = {
    'sign_in_screen.dart': None,
    'parent_registration_screen.dart': None,
    'student_registration_screen.dart': None,
    'coach_registration_screen.dart': None
}

for line in open(path, 'r', encoding='utf-8'):
    try:
        data = json.loads(line)
        step = data.get('step_index')
        if step > 1500:
            break
            
        if 'tool_calls' in data:
            for tc in data['tool_calls']:
                name = tc.get('name')
                if name == 'write_to_file' or name == 'replace_file_content':
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
                                if name == 'write_to_file':
                                    contents[k] = args.get('CodeContent', '')
                                elif name == 'replace_file_content':
                                    # Very hard to reconstruct file from replacements, 
                                    # but we can try to find the full file if it was read or written.
                                    pass
    except Exception as e:
        pass

# Wait, if we can't reconstruct replace_file_content, let's just find the last time it was READ before step 1500!
contents_read = {
    'sign_in_screen.dart': None,
    'parent_registration_screen.dart': None,
    'student_registration_screen.dart': None,
    'coach_registration_screen.dart': None
}

for line in open(path, 'r', encoding='utf-8'):
    try:
        data = json.loads(line)
        step = data.get('step_index')
        if step > 1500:
            break
        # Check tool responses for view_file
        if data.get('type') == 'TOOL_RESPONSE':
            for res in data.get('tool_responses', []):
                out = res.get('output', '')
                for k in contents_read.keys():
                    if f'c:/Users/kmabd/myapp/lib/{k}' in out or f'c:\\Users\\kmabd\\myapp\\lib\\{k}' in out:
                        contents_read[k] = out
    except:
        pass

for k, v in contents_read.items():
    if v:
        # Strip line numbers from view_file output
        lines = []
        for l in v.split('\n'):
            if ': ' in l and l.split(': ')[0].isdigit():
                lines.append(l.split(': ', 1)[1])
        with open(f'lib/{k}', 'w', encoding='utf-8') as f:
            f.write('\n'.join(lines))
        print(f"Restored {k} from view_file output!")

