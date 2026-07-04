import json

path = r'C:\Users\kmabd\.gemini\antigravity\brain\bf626562-4ae5-498f-893c-9e2e4841f211\.system_generated\logs\transcript_full.jsonl'
out_path = r'C:\Users\kmabd\myapp\dump.txt'

with open(out_path, 'w', encoding='utf-8') as out:
    for line in open(path, 'r', encoding='utf-8'):
        try:
            if 'parent_registration_screen.dart' in line:
                data = json.loads(line)
                step = data.get('step_index')
                if 'tool_calls' in data:
                    for tc in data['tool_calls']:
                        name = tc.get('name')
                        if name in ['write_to_file', 'replace_file_content']:
                            out.write(f"STEP {step}: {name}\n")
                            args = tc.get('arguments', {})
                            if isinstance(args, str):
                                try:
                                    args = json.loads(args)
                                except:
                                    pass
                            if isinstance(args, dict):
                                out.write(str(args)[:500] + "\n\n")
        except Exception as e:
            pass
