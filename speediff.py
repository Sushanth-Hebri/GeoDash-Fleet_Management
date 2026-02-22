import subprocess
import itertools
import sys
import os


# -----------------------------
# Run shell command
# -----------------------------
def run(cmd):
    return subprocess.run(cmd, capture_output=True, text=True)


# -----------------------------
# Count real conflict blocks
# -----------------------------
def count_conflict_blocks():
    # Get files with unresolved conflicts
    result = run(["git", "diff", "--name-only", "--diff-filter=U"]).stdout.strip()

    if not result:
        return 0

    files = result.splitlines()
    total_blocks = 0

    for file in files:
        if os.path.exists(file):
            with open(file, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()
                total_blocks += content.count("<<<<<<<")

    return total_blocks


# -----------------------------
# Simulate one merge order
# -----------------------------
def simulate_order(order):
    total_score = 0

    # Create/reset temp branch from origin/main
    run(["git", "checkout", "-B", "temp-merge-sim", "origin/main"])

    for branch in order:
        print(f"  Merging {branch}...")

        merge = run([
            "git", "merge",
            "--no-commit",
            "--no-ff",
            f"origin/{branch}"
        ])

        if merge.returncode != 0:
            # Conflict occurred
            blocks = count_conflict_blocks()
            score = blocks * 20
            total_score += score

            print(f"    Conflict blocks: {blocks} | Score added: {score}")

            # Abort the failed merge
            run(["git", "merge", "--abort"])

            # Re-merge using automatic resolution to continue simulation
            run([
                "git", "merge",
                "--no-commit",
                "--no-ff",
                "-X", "ours",
                f"origin/{branch}"
            ])

            run(["git", "commit", "-m", "auto-resolved for simulation"])

        else:
            # Clean merge
            run(["git", "commit", "-m", "clean merge"])
            print("    Clean merge (no conflicts)")

    # Cleanup temp branch
    run(["git", "checkout", "main"])
    run(["git", "branch", "-D", "temp-merge-sim"])

    return total_score


# -----------------------------
# Find global optimal order
# -----------------------------
def find_best_order(branches):
    best_order = None
    best_score = float("inf")

    permutations = list(itertools.permutations(branches))
    print(f"\nTesting {len(permutations)} possible merge orders...\n")

    for perm in permutations:
        print(f"Testing order: {perm}")
        score = simulate_order(perm)
        print(f"Total score for this order: {score}\n")

        if score < best_score:
            best_score = score
            best_order = perm

    return best_order, best_score


# -----------------------------
# Entry point
# -----------------------------
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python speediff.py branch1 branch2 branch3 ...")
        sys.exit(1)

    branches = sys.argv[1:]

    # Ensure working directory is clean
    status = run(["git", "status", "--porcelain"]).stdout.strip()
    if status:
        print("❌ Working directory not clean. Commit or stash changes first.")
        sys.exit(1)

    # Fetch latest remote changes
    run(["git", "fetch", "origin"])

    best_order, best_score = find_best_order(branches)

    print("\n==========================================")
    print("🏆 Optimal Merge Order (Global Minimum)")
    print("==========================================\n")

    for i, branch in enumerate(best_order, 1):
        print(f"{i}. {branch}")

    print(f"\nTotal Cumulative Conflict Score: { best_score}")
    print("==========================================\n")
