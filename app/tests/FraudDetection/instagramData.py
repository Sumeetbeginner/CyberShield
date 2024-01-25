# Import necessary libraries and modules
from flask import render_template, Flask, request, jsonify
from app import app
import instaloader
import json
import os
import requests
from PIL import Image
from io import BytesIO

# Function to detect fraud in a user's profile
@app.route('/detect_fraud_profile', methods=['POST'])
def detect_fraud_profile():
    data = request.get_json()
    username = data.get('username')

    if not profile_exists(username):
        return jsonify({'error': f"Profile for '{username}' does not exist."})

    load_profile_data(username)
    load_posts(username)

    return jsonify({'result': 'Detection result'})

# Function to check if a profile exists
def profile_exists(username):
    try:
        L = instaloader.Instaloader()
        instaloader.Profile.from_username(L.context, username)
        return True
    except instaloader.ProfileNotExistsException:
        return False
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return False

# Function to load profile data
def load_profile_data(username):
    try:
        L = instaloader.Instaloader()
        profile = instaloader.Profile.from_username(L.context, username)

        user_data = {
            'Username': username,
            'Followers': profile.followers,
            'Following': profile.followees,
            'Bio': profile.biography,
            'Verified': profile.is_verified,
            'Name': profile.full_name,
            'ExternalLink': profile.external_url or 'Not Found',
            'NumberOfPosts': profile.mediacount,
        }

        profile_folder = os.path.join(os.getcwd(), username, f'{username}_profile')
        os.makedirs(profile_folder, exist_ok=True)

        json_filename = os.path.join(profile_folder, 'profile_data.json')
        with open(json_filename, 'w') as json_file:
            json.dump(user_data, json_file, indent=4)

        profile_pic_url = profile.get_profile_pic_url()

        if profile_pic_url:
            profile_pic_filename = os.path.join(profile_folder, 'profile_pic.jpg')
            img_data = requests.get(profile_pic_url).content
            with open(profile_pic_filename, 'wb') as img_file:
                img_file.write(img_data)

        print(f"Profile data for '{username}' has been saved in the '{profile_folder}' folder.")

    except instaloader.ProfileNotExistsException:
        print(f"Profile for '{username}' does not exist.")
    except Exception as e:
        print(f"An error occurred: {str(e)}")

# Function to download and resize an image
def download_and_resize_image(url, username, post_number):
    try:
        response = requests.get(url)
        response.raise_for_status()

        image_data = BytesIO(response.content)
        img = Image.open(image_data)
        img = img.resize((240, 240), Image.LANCZOS)

        if not os.path.exists(username):
            os.makedirs(username)

        posts_folder = os.path.join(username, f'{username}_posts')
        os.makedirs(posts_folder, exist_ok=True)

        filename = os.path.join(posts_folder, f"{username}_post_{post_number}.jpg")
        img.save(filename)

        print(f"Image downloaded and saved as {filename}")
    except requests.exceptions.HTTPError as errh:
        print("HTTP Error:", errh)
    except requests.exceptions.ConnectionError as errc:
        print("Error Connecting:", errc)
    except requests.exceptions.Timeout as errt:
        print("Timeout Error:", errt)
    except requests.exceptions.RequestException as err:
        print("Something went wrong:", err)
    except Exception as e:
        print("An error occurred:", str(e))

# Function to load posts
def load_posts(username):
    try:
        L = instaloader.Instaloader()
        profile = instaloader.Profile.from_username(L.context, username)

        post_number = 1
        posts_folder = os.path.join(username, f'{username}_posts')
        captions_folder = os.path.join(username, f'{username}_captions')

        os.makedirs(posts_folder, exist_ok=True)
        os.makedirs(captions_folder, exist_ok=True)

        captions_list = []

        profile_data_path = os.path.join(username, f'{username}_profile', 'profile_data.json')
        if os.path.exists(profile_data_path):
            with open(profile_data_path, 'r') as profile_data_file:
                profile_data = json.load(profile_data_file)
                total_posts = min(profile_data.get('NumberOfPosts', 0), 20)

                for post in profile.get_posts():
                    if post.typename == 'GraphImage':
                        download_and_resize_image(post.url, username, post_number)

                        captions_list.append({
                            'PostNumber': post_number,
                            'Caption': post.caption,
                        })

                        post_number += 1

                    if post_number > total_posts:
                        break

                captions_filename = os.path.join(captions_folder, 'captions.json')
                with open(captions_filename, 'w') as captions_file:
                    json.dump(captions_list, captions_file, indent=4)

                print(f"{total_posts} image posts from '{username}' have been downloaded and saved in the '{posts_folder}' folder.")

        else:
            print(f"Profile data not found for '{username}'. Please run load_profile_data first.")

    except instaloader.ProfileNotExistsException:
        print(f"Profile for '{username}' does not exist.")
    except Exception as e:
        print(f"An error occurred: {str(e)}")

if __name__ == '__main__':
    app.run(debug=True)
