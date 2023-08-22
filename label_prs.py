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

if __name__ == "__main__":
    event_data = json.loads(os.environ.get("GITHUB_EVENT_PATH", "{}"))
    pull_request_number = event_data.get("pull_request", {}).get("number")
    
    if pull_request_number:
        labels = {
            "labels": ["automerge"]  # Customize the labels as needed
        }
        label_pull_request(pull_request_number, labels)
        print("Labels added successfully.")
    else:
        print("No pull request number found in the event data.")
