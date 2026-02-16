## Presigned URL Pattern Analysis

### Current Implementation

**Upload Flow:**
1. Client requests presigned upload URLs from `/api/images/uploadUrls` with image filenames
2. Server generates unique filenames (baseName-uuid.extension) and creates presigned PUT URLs (7-day expiration)
3. Client uploads files directly to S3 using presigned URLs
4. Client calls `/api/images/:documentId` to associate uploaded images with document

**Download Flow:**
1. Client requests presigned download URLs from `/api/images/downloadUrls` with documentId and image names
2. Server validates user has access to the document and images belong to that document
3. Server generates presigned GET URLs (1-day expiration)
4. Client displays images