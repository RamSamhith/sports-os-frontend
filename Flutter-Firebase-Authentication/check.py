content = open("lib/sign_in_screen.dart").read()
lines = content.split("\n")
stack = []
for i, line in enumerate(lines):
    for j, c in enumerate(line):
        if c in "({[":
            stack.append((c, i+1, j+1))
        elif c in ")}]":
            if not stack:
                print(f"Unmatched {c} at {i+1}:{j+1}")
                exit(1)
            last_c, last_i, last_j = stack.pop()
            if (last_c == "(" and c != ")") or (last_c == "{" and c != "}") or (last_c == "[" and c != "]"):
                print(f"Mismatched {c} at {i+1}:{j+1}, expected match for {last_c} from {last_i}:{last_j}")
                exit(1)
if stack:
    print(f"Unmatched brackets remaining: {stack}")
else:
    print("All brackets match")
