import os
import csv
import time
import requests
from bs4 import BeautifulSoup


"""
Save last iteration number to file_path
"""
def save_range(file_path, last_iteration):
    with open(file_path, "w") as file:
        file.write(str(last_iteration))


"""
Load last iteration from file_path
"""
def load_range(file_path, default_start):
    if os.path.exists(file_path):
        with open(file_path, "r") as file:
            return int(file.read()) + 1
    else:
        return default_start


"""
Extract text and code from a div element
"""
def extract_text_with_code(question_div):
    result_text = ""
    p_tags = question_div.find_all('p')
    code_tags = question_div.find_all('pre')
    for i in range(max(len(p_tags), len(code_tags))):
        if i < len(p_tags):
            result_text += p_tags[i].get_text() + "\n"
        if i < len(code_tags):
            code_text = code_tags[i].find('code').get_text() if code_tags[i].find('code') else ""
            result_text += f"<code>{code_text}</code>\n"
    return result_text.replace('\n', ' ').replace('\t', ' ')


"""
Scrap data from stackoverflow, only keep posts with accepted answer
Return question_title, question_text, answer_text
"""
import requests

def get_stackoverflow_data(question_id):
    url = f"https://api.stackexchange.com/2.2/questions/{question_id}?site=stackoverflow&tagged=reactjs"
    response = requests.get(url)
    
    if response.status_code == 200:
        data = response.json()

        if 'items' in data and data['items']:
            question_data = data['items'][0]

            question_timestamp = question_data.get('creation_date')
            question_title = question_data.get('title')
            question_text = question_data.get('body_markdown')

            # Extracting the accepted answer (if available)
            accepted_answer = next((a for a in question_data.get('answers', []) if a.get('is_accepted', False)), None)
            answer_text = accepted_answer.get('body_markdown') if accepted_answer else None

            return question_timestamp, question_title, question_text, answer_text
        else:
            print(f"No data found for question ID {question_id}")
            return None, None, None, None
    else:
        print(f"Error fetching data for question ID {question_id}: {response.status_code}")
        return None, None, None, None

# Example usage
question_id = 47161385  # Replace with the desired question ID
result = get_stackoverflow_data(question_id)

# Print the result (you can modify this part based on your needs)
if result:
    question_timestamp, question_title, question_text, answer_text = result
    print(f"Question Timestamp: {question_timestamp}")
    print(f"Question Title: {question_title}")
    print(f"Question Text: {question_text}")
    print(f"Answer Text: {answer_text}")



def save_to_csv(filename, data):
    with open(filename, 'a', newline='', encoding='utf-8') as csv_file:
        csv_writer = csv.writer(csv_file, delimiter="\t")
        csv_writer.writerow(data)


if __name__ == "__main__":
    iteration_filename = "last_iteration.txt"
    start_iteration = load_range(iteration_filename, 1)
    csv_filename = "accepted_answers.csv"

    for question_id in range(start_iteration + 1, start_iteration + 20):
        result = get_stackoverflow_data(question_id)
        if (result is not None) and (result[0] is not None) and (result[0] != ""):
            date, title, question, answer = result
            save_to_csv(csv_filename, [date, question_id, title, question, answer])
            print(f"Question ID {question_id}: Saved to CSV")
        else:
            print(f"Question ID {question_id}: not saved")
        last_iteration = question_id
        time.sleep(0.7)
    save_range(iteration_filename, last_iteration)