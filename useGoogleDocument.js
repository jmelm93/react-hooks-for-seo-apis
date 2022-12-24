import { useEffect, useState } from 'react';
import {getGoogleFileId} from 'utils/getGoogleFileId';

export const useGoogleDocument = () => {
    const [document, setDocument] = useState(null);
    const [error, setError] = useState(null);

    const fetchDriveDoc = async ({url, accessToken}) => {
        try {
            // Extract the file ID from the URL
            const fileId = getGoogleFileId(url);
            
            // exporting files - 10mb Max File Size - https://developers.google.com/drive/api/v3/reference/files/export
            // GET https://www.googleapis.com/drive/v3/files/{{FILE_ID}}/export?mimeType={{MIME_TYPE}}&key=[YOUR_API_KEY] HTTP/1.1

            // Make the API request to retrieve the document
            const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/export?mimeType=application%2Fvnd.openxmlformats-officedocument.wordprocessingml.document`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            
            // response is a raw .docx file based on using mimeType=application%2Fvnd.openxmlformats-officedocument.wordprocessingml.document
            setDocument(response); 

        } catch (e) {
            setError(e);
            setDocument(null);
        }
    }
    return { document, error, fetchDriveDoc };
}
