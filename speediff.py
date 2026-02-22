import subprocess
import json
import os
import re

BASE_BRANCH = "main"


def run(cmd):
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    return result.stdout.strip()


def get_merge_tree_output(base, head, branch):
    return run(f"git merge-tree {base} {head} {branch}")


def analyze_conflicts(merge_output):
    conflict_blocks = re.findall(r"<<<<<<<.*?>>>>>>>.*?\n", merge_output, re.DOTALL)

    conflict_lines = sum(len(block.split("\n")) for block in conflict_blocks)

    file_paths = re.findall(r"changed in both\n\s+(.*)", merge_output)

    return {
        "conflict_lines": conflict_lines,
        "block_count": len(conflict_blocks),
        "file_count": len(file_paths),
    }


def structural_score(data):
    score = 0
    score += data["conflict_lines"] * 0.3
    score += data["block_count"] * 5
    score += data["file_count"] * 10
    return score


def ask_llm(data):
    from google import genai

    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        return {
            "difficulty_score": 50,
            "reason": "No API key found"
        }

    client = genai.Client(api_key=api_key)

    prompt = f"""
Rate merge difficulty from 0 to 100.

Conflict summary:
- Conflict lines: {data["conflict_lines"]}
- Conflict blocks: {data["block_count"]}
- Files involved: {data["file_count"]}

Respond strictly in JSON:
{{ "difficulty_score": number, "reason": "short sentence" }}
"""

    try:
        response = client.models.generate_content(
            model="models/gemini-2.0-flash",
            contents=prompt,
        )

        text = response.text.strip()

        return json.loads(text)

    except Exception as e:
        return {
            "difficulty_score": 50,
            "reason": f"LLM error: {str(e)}"
        }


def optimize(branches):
    run("git fetch")

    current_head = run(f"git rev-parse origin/{BASE_BRANCH}")
    order = []

    for branch in branches:
        branch_commit = run(f"git rev-parse origin/{branch}")
        base = run(f"git merge-base {current_head} {branch_commit}")

        merge_output = get_merge_tree_output(base, current_head, branch_commit)
        data = analyze_conflicts(merge_output)

        s_score = structural_score(data)
        llm = ask_llm(data)

        final_score = 0.5 * s_score + 0.5 * llm["difficulty_score"]

        order.append((branch, final_score, llm["reason"]))

    order.sort(key=lambda x: x[1])
    return order


if __name__ == "__main__":
    import sys

    branches = sys.argv[1:]
    result = optimize(branches)

    print("\nBest order to merge:\n")
    for i, (branch, score, reason) in enumerate(result, 1):
        print(f"{i}. {branch} | Score: {score:.2f} | {reason}")
