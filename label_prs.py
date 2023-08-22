import requests
import os
import json

# Replace these with your actual values
repo_owner = "mihirm21"
repo_name = "ofep_final"
token = os.environ.get("GITHUB_TOKEN")

headers = {
    "Authorization": f"Bearer {token}",
    "Accept": "application/vnd.github.v3+json"
}

def label_pull_request(pull_request_number, labels):
    url = f"https://api.github.com/repos/{repo_owner}/{repo_name}/issues/{pull_request_number}/labels"
    response = requests.post(url, json=labels, headers=headers)
    response.raise_for_status()

def main():
    event_path = os.environ.get("GITHUB_EVENT_PATH")
    
    if event_path:
        with open(event_path, "r") as event_file:
            event_data = json.load(event_file)
            pull_request_number = event_data.get("pull_request", {}).get("number")
            
            if pull_request_number:
                labels = {
                    "labels": ["automerge"]  # Customize the labels as needed
                }
                label_pull_request(pull_request_number, labels)
                print("Labels added successfully.")
            else:
                print("No pull request number found in the event data.")
    else:
        print("GITHUB_EVENT_PATH not set. Are you running the script outside GitHub Actions?")

if __name__ == "__main__":
    main()
