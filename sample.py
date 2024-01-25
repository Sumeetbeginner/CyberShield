
import csv
from faker import Faker
import random

fake = Faker()

# Function to generate a random entry
def generate_entry():
    caption = fake.sentence()
    bio = fake.sentence()
    post_content = fake.paragraph()
    fraud_rating = random.choice([0, 1])
    return caption, bio, post_content, fraud_rating

# Generate 100 entries
entries = [generate_entry() for _ in range(100)]

# Write data to CSV file
with open('instagram_dataset.csv', 'w', newline='', encoding='utf-8') as csvfile:
    fieldnames = ['caption', 'bio', 'post_content', 'fraud_rating']
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

    writer.writeheader()
    for entry in entries:
        writer.writerow({'caption': entry[0], 'bio': entry[1], 'post_content': entry[2], 'fraud_rating': entry[3]})
