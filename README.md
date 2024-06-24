# ChatterUp (Real-Time Chat Application)
ChatterUp is an interactive real-time chat application designed to facilitate seamless communication and interaction between users. Built using Node.js, Express.js, Socket.io, and MongoDB, it offers a robust and engaging chat experience.

# Features
## Socket-Based Architecture
ChatterUp utilizes WebSockets via the Socket.io library, enabling real-time, bidirectional communication between users.
## Code Modularity
The project follows modern development practices by employing ES6 Modules for code organization, ensuring maintainability and collaboration.
## User-Friendly Chat UI
The chat user interface is thoughtfully designed to enhance the user experience. It features components for seamless chatting and a notification panel displaying online users.
## User Onboarding
New users are prompted to provide their name upon joining ChatterUp for the first time. A warm welcome message is displayed in the header with their name.
## Chat History and User Count
Newly joined users have access to chat history and receive real-time information about the number of users currently online.
## Broadcasting Messages and Database Storage
Messages sent by users are broadcasted to all connected users in real-time and securely stored in the database for future reference.
## User Typing Indicators
A 'typing...' indicator is displayed to all connected users as users type messages, indicating which user is currently typing.
## Notification of New User Joins
When a new user joins, their name is added to the notification panel with an online symbol (green dot), and all connected users are notified.
## Notification of User Disconnections
When a user leaves the application, the notification panel is updated to reflect the remaining connected users.
## Profile Pictures for User Consistency
Each user has an associated profile picture displayed throughout the conversation, ensuring consistent visual identity.
## Displaying Chat Messages
Chat messages display the user's name, profile picture, message content, and timestamp for a comprehensive chat experience.

# API Structure
The API structure for ChatterUp includes routes for rendering the UI, managing user authentication, handling chat messages, and more.




