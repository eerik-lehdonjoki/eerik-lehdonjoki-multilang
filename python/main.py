import csv, sys
from statistics import mean
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CSV_PATH = ROOT / "users.csv"

def load_users(path):
    try:
        with open(path, newline="", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            return [row for row in reader]
    except FileNotFoundError:
        print(f"Could not find CSV at {path}")
        return []

def filter_users_by_minimum_age(users, threshold=30):
    filtered_users = []
    for u in users:
        if int(u["age"]) >= threshold:
            filtered_users.append(u)
    return filtered_users

def count_users_by_country(users):
    country_count = {}
    for user in users:
        user_country = user["country"]
        country_count[user_country] = country_count.get(user_country, 0) + 1
    return country_count

def calculate_users_average_age(users):
    if not users:
        return 0.0
    
    ages = []
    for user in users:
        ages.append(int(user["age"]))

    avg = mean(ages)
    return round(avg, 1)

def get_top_n_oldest_users(users, n=3):
    return sorted(users, key=lambda user: int(user["age"]), reverse=True)[:n]

def get_region_for_country(country: str) -> str:
    match country:
        case "Finland" | "Germany" | "France" | "UK":
            return "Europe"
        case "USA" | "Canada":
            return "North America"
        case "Brazil":
            return "South America"
        case "India" | "Japan":
            return "Asia"
        case "Australia":
            return "Oceania"
        case _:
            return "Other"

def users_by_region(users):
    regions = Counter(get_region_for_country(u["country"]) for u in users)
    print("Users per region:")
    for r, n in regions.items():
        print(f"  {r}: {n}")

def do_summary(users):
    total = len(users)
    filtered = filter_users_by_minimum_age(users)
    grouped = count_users_by_country(users)
    avg_age = calculate_users_average_age(users)
    oldest_users = get_top_n_oldest_users(users, 3)

    print(f"Total users: {total}")
    print(f"Filtered count: {len(filtered)}")
    print("Users per country:")
    for country, amount in grouped.items():
        print(f"  {country}: {amount}")
    print(f"Average age: {avg_age}")
    print("Top 3 oldest users:")
    for user in oldest_users:
        print(f"  {user['name']} ({user['age']})")

# Main function
def main():
    # Load users from CSV
    users = load_users(CSV_PATH)

    # Check if users were loaded successfully
    if not users:
        return

    # Determine operation from command line argument
    operation = sys.argv[1] if len(sys.argv) > 1 else "summary"

    if operation == "summary":
        do_summary(users)
        return

    if operation == "filter":
        print(f"Filtered count: {len(filter_users_by_minimum_age(users))}")
        return

    if operation == "group":
        print("Users per country:")
        for c, n in count_users_by_country(users).items():
            print(f"{c}: {n}")
        return

    if operation == "avg":
        print(f"Average age: {calculate_users_average_age(users)}")
        return

    if operation == "top":
        for u in get_top_n_oldest_users(users):
            print(f"{u['name']} ({u['age']})")
        return

    if operation == "region":
        users_by_region(users)
        return

    print(f"Unknown operation '{operation}'. Use summary|filter|group|avg|top|region.")

# Entry point
if __name__ == "__main__":
    main()
