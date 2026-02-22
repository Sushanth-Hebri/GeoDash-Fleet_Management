import subprocess
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


def calculate_difficulty(data):
    score = 0

    # Line complexity (small weight)
    score += data["conflict_lines"] * 0.5

    # Logical conflict blocks (medium weight)
    score += data["block_count"] * 8

    # Cross-file conflicts (heavy weight)
    score += data["file_count"] * 15

    # Extra penalty if many files
    if data["file_count"] >= 5:
        score += 20

    return score


def generate_reason(data):
    if data["file_count"] == 0:
        return "No conflicts detected"

    if data["file_count"] > 5:
        return "High cross-file conflict risk"

    if data["block_count"] > 10:
        return "Multiple logical conflict blocks"

    if data["conflict_lines"] > 50:
        return "Large conflicting code sections"

    return "Moderate merge complexity"


def optimize(branches):
    run("git fetch")

    current_head = run(f"git rev-parse origin/{BASE_BRANCH}")
    order = []

    for branch in branches:
        branch_commit = run(f"git rev-parse origin/{branch}")
        base = run(f"git merge-base {current_head} {branch_commit}")

        merge_output = get_merge_tree_output(base, current_head, branch_commit)
        data = analyze_conflicts(merge_output)

        score = calculate_difficulty(data)
        reason = generate_reason(data)

        order.append((branch, score, reason))

    order.sort(key=lambda x: x[1])
    return order


if __name__ == "__main__":
    import sys

    branches = sys.argv[1:]

    if not branches:
        print("Provide branch names to evaluate.")
        exit(1)

    result = optimize(branches)

    print("\nBest order to merge:\n")
    for i, (branch, score, reason) in enumerate(result, 1):
        print(f"{i}. {branch} | Score: {score:.2f} | {reason}")
