# Serendipity Generator

Serendipity Generator is a random activity generator designed to help people find engaging activities to do. Powered by the OpenAI API, this app takes user information into account to provide personalized suggestions. Whether you're looking for a new hobby, a sports activity, a board game, or even a video game, Serendipity Generator has got you covered.

## Installation

To run locally, you need a valid OpenAI API key. You also need credits in your OpenAI account (a few free credits are usually handed on account creation). Refer to [OpenAI](https://platform.openai.com/docs/introduction) for API documentation and their usage policy.

Please ensure you have the following modules installed:

```
express
dotenv
express-rate-limit
openai
```

Clone the repository:

```
git clone https://github.com/fotmjay/serendipity-gen.git
```

Install the required modules:

```
npm install
```

Set up your OpenAI API credentials in the .env file:

```
OPENAI_API_KEY =  YOUR_KEY
OPENAI_ORG = YOUR_ORG
```

## Usage

Start the application with `npm start`.

Visit `http://localhost:3000` in your web browser.

Enter your preferences and click the "Generate" button to receive a serendipitous activity suggestion.

# App Improvements

### User Interface Enhancement

The UI is very basic and needs improvement to provide a visually appealing experience for users.

### Expanded Categories

In addition to activities, categories will be expanded to include hobbies, sports, board games, and video games. This will allow users to explore a wider range of interests.

### Information Profiles

Implement user profiles to gather more detailed information about users' preferences, interests, and past activities. This will enable more accurate and tailored activity suggestions.

### Integration with External APIs

Integrate with external APIs such as game databases to enhance the activity suggestions with real-time data and community recommendations.

### Machine Learning Enhancement

Train the model to improve the accuracy and relevance of the generated suggestions.

```
Note:  Prompt querying works well but quickly becomes expensive as the precision of the prompt is increased.
```

# Lessons Learned

### API Integration

Gain experience in integrating third-party APIs into a project, in this case, the OpenAI API.

### Server-side Development

Learn how to build a server-side application using Express.js, handle API requests, and manage user data.

### Environment Setup

Understand how to configure and use environment variables to secure sensitive information, such as API keys.

### AI Usage

Improve knowledge of AI usage: prompts engineering (input refining), queries, follow-ups, moderation.

### AI Model Fine-Tuning

Learn the basics of AI model fine-tuning.

### Rate limiting

Improve knowledge of rate limit fundamentals and implement a basic rate-limit protection on the API requests.

# Difficulties Encountered

While developing the Serendipity Generator app, I encountered several challenges that helped me grow. Some of the difficulties I faced include:

### API Configuration

Setting up and configuring the OpenAI API for the first time required understanding the authentication process and handling API requests effectively. The documentation offered by OpenAI, while still offering JavaScript-targeted information, was mostly aimed at Python developers.

### Secret Handling

I had to do some reading on managing secret information (APIKEY, ORGKEY) to ensure I would not leak those secrets when uploading the code.

### Prompt Engineering

A lot of trial and error was done to improve the chatbot's answers while simultaneously reducing the number of tokens needed to produce high-quality suggestions (budget considerations vs quality control)

### Data Handling

Parsing through user-input and through OpenAI's Chatbot answers to select and organize the data as needed was a lot of trial and error.

### Testing and Debugging

Ensuring the app functions correctly.
