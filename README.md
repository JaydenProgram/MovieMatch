
# MovieMatch

## Introduction
Welcome to MovieMatch (OG), a movie recommendation system that recommends movies based on your preference. This is a school project, using Langchain JS with OpenAI.

## Features

- Recommends movies based on user input, including preferences such as genre and age group.
- Has a chat history to improve recommendation accuracy.
- A user-friendly interface that is easy to use.
- Displays movie recommendations and also includes images.

## Setup Instructions
1. Clone the repository to your local machine using the following command:
   ```
   git clone https://github.com/JaydenProgram/AIPRroject.git
   ```

2. Navigate to the project directory:
   ```
   cd AIProject
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Create a `.env` file in the root directory and add your Azure OpenAI API key:
   ```
   OPENAI_API_TYPE=<Your OpenAI API Type>
   OPENAI_API_VERSION=<Your OpenAI API Version>
   OPENAI_API_BASE=<Your OpenAI API Base URL>
   AZURE_OPENAI_API_KEY=<Your Azure OpenAI API Key>
   DEPLOYMENT_NAME=<Your Deployment Name>
   ENGINE_NAME=<Your Engine Name>
   INSTANCE_NAME=<Your Instance Name>
   TMDB_API_KEY=<Your TMDB API Key>
   BEARER_KEY=<Your Bearer Key>
   UPSTASH_REDIS_REST_URL=<Your Upstash Redis REST URL>
   UPSTASH_REDIS_REST_TOKEN=<Your Upstash Redis REST Token>
   ```

5. Start the server:
   ```
   npm start
   ```

6. Front end is also included for this project:
   Install the dependencies aswell and start with npm run dev.
   This will provide a link you can use to acces the front end.

## Usage
- Enter information about yourself, including your interests and age group, to receive personalized movie recommendations.
- Explore the recommended movies displayed on the interface.
- Cancel the recommendation process at any time by clicking the "Cancel" button.

## Important
- For now both front and back (client/server) are in the same folder.
  This means you would need to seperate these to a server and client folder if you want to use a live server for example
