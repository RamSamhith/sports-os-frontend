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
                            args = tc.get('arguments', {})
                            
                            # Arguments is usually a dict already if parsed from tool_calls
                            if isinstance(args, str):
                                try:
                                    args = json.loads(args)
                                except:
                                    pass
                            
                            target = args.get('TargetFile', '') if isinstance(args, dict) else ''
                            if 'parent_registration_screen.dart' in target:
                                out.write(f"STEP {step}: {name}\n")
                                out.write(str(args.get('CodeContent', ''))[:100] + "\n")
                                out.write("===\n")
        except Exception as e:
            pass
