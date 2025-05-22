# Our Story

An application made by Andy and Arya so that they can record every memory they make together. Arya likes to re-read dates and Andy likes to build web apps <3. 

## Technologies Involved 
React, TypeScript, Vite, Node, Express, AWS S3, AWS Cognito, Sequelize, Github actions, Alembic

## Architectural Diagram
![image](https://github.com/user-attachments/assets/f594fbed-7c81-419c-aaf3-c5f773243f92)

## Demo 
[![our_story_demo](https://github.com/user-attachments/assets/f99b5508-91eb-4743-847d-811217912c06)](https://www.youtube.com/watch?v=ttlGVR0JQ0c)

## Components of our application 

**Frontend: React, Tailwind, Vite** <br>
<br>
**Flipbook:**
- Created a custom flipbook in React and Tailwind CSS without using third-party APIs, handling all CSS transitions and z-index layering of pages manually using useState hooks
- Resolved race conditions across interdependent useState hooks by designing and implementing finite state machine-style logic to manage complex asynchronous state transitions reliably
- Implemented dynamic pagination to efficiently fetch documents in chunks, maintaining accurate page indexing across refetches for seamless user experience.
- Attempted to integrate react-pageflip, but opted for a custom solution due to its limitations with rendering different page components: https://github.com/Nodlik/react-pageflip/issues/2


**Collaborative text editor**: 
- Built a real-time collaborative text editor using TipTap, enabling simultaneous multi-user editing
- Implemented a cleanup function in useEffect to destroy the WebSocket provider on page transitions, limiting concurrent connections when users flip pages to one


**Image Carousel**:
- Utilized server-side generated signed URLs for image upload and retrieval via Amazon S3 inorder to offload file transfer traffic from our servers, resulting in decreased server hosting costs

**All Stories page**: 
- Implemented infinite scrolling and pagination similar to Instagram, enabling seamless content loading as users scroll

**Backend: Node, Express, Sequelize**
**Server**: 
- Set up a cron job to sync documents from TipTap Cloud into our database, ensuring a consistent and up-to-date local copy of all content for reliability and backup purposes
- Configured GitHub Actions to automate daily pg_dump backups of our database and used the AWS CLI to store them in the S3 Glacier tier, reducing long-term storage costs
## Challenges
**Flipbook**: 
- The flipbook component was by far the most challenging part of the application. I initially searched for a suitable library and found react-pageflip, which I almost got working. However, I ran into a critical limitation: the function to programmatically jump to a specific page didn't work as expected. After extensive digging, I found a GitHub comment explaining that dynamically generated pages require identical child components across all pages—a major constraint for my use case. As a result, I decided to build the flipbook from scratch, carefully managing CSS z-index changes and flip animations using useState. In hindsight, useReducer might have been a better fit, since my implementation closely resembled a finite state machine with interdependent state transitions. 
- Additionally, the flipbook needed to paginate documents efficiently to avoid loading all of them at once. This required implementing a refetching mechanism while maintaining accurate tracking of the current page index, even after new data was fetched. Ensuring smooth user experience during dynamic data loading added another layer of complexity to the component's logic.
- I also had to debug asynchronous issues, such as users rapidly clicking the "next page" button—something that couldn’t be fully mitigated with simple debouncing. 

**Collaborative Text Editor**:
- I built the collaborative editor using TipTap. One of the main challenges was managing the number of concurrent WebSocket connections, as the free tier has a strict limit. Since each page in the flipbook contains an editor, I had to ensure that only one active connection exists per user at any given time, regardless of how many pages they flip through. To handle this, I implemented cleanup functions in useEffect to properly close and manage connections. Another key challenge was syncing user edits (which were sent to TipTap Cloud via WebSocket) with our own database. Sending a PUT request on every keystroke would have defeated the purpose of using WebSockets, so I opted to flag any edited documents and perform a nightly sync to persist changes. This project also helped me improve at reading and understanding documentation for new libraries.

**Image handling**: 
- I used AWS S3 for image storage, but noticed that many tutorials recommended making the bucket public (probably for the sake of making the tutorial easy). Instead, I configured the bucket with public access blocked and created an IAM user with permission policies to upload, retrieve, and delete objects. In our application, we generate signed URLs server-side and pass them to the frontend. The frontend then uses these URLs to interact directly with S3 for uploading, fetching, and deleting images. This approach not only keeps the bucket secure but also offloads traffic from our server, helping to reduce hosting costs.

