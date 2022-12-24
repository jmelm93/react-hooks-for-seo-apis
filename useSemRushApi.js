import { useState } from 'react';
import dayjs from 'dayjs';

//example use
//
// const ExampleComponent = () => {
//     const [apiKey, setApiKey] = useState('');
//     const { data, isLoading, error, fetchSemRushApi } = useSemRushApi(apiKey);
//
//     const handleFetch = () => {
//       fetchSemRushApi({
//         type: 'url_organic',
//         options: {
//           url: 'example.com',
//           database: 'us',
//           display_limit: 20,
//         },
//       });
//     };
//
//     return (
//       <div>
//         <label htmlFor="api-key-input">Enter Semrush API Key:</label>
//         <input
//           id="api-key-input"
//           type="text"
//           value={apiKey}
//           onChange={(event) => setApiKey(event.target.value)}
//         />
//         {isLoading && <div>Loading...</div>}
//         {error && <div>{error.message}</div>}
//         {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
//         <button onClick={handleFetch}>Fetch Data</button>
//       </div>
//     );
//   };

const availableScopes = [
    {
        type: 'url_organic',
        apiDocs: 'https://developer.semrush.com/api/v3/analytics/url-reports/#url-organic-search-keywords/',
        requiredOptions: [
            'url',
            'database'
        ],
        optionalOptions: [
            'display_limit',
            'display_offset',
            'export_escape',
            'export_decode',
            'display_date',
            'export_columns',
            'display_sort',
            'display_filter'
        ],
        defaultOptions: {
            display_limit: 10, // 10 results returned
            display_offset: 0, // start at the first result
            // export_escape: "1", // If this parameter uses the value "1", the report’s columns will be wrapped in double quotation marks (").
            // export_decode: "0", // If this parameter uses the value "0", the response will be sent as a URL-encoded string; if "1", the response will not be converted.
            display_date: dayjs().subtract(1, 'month').format('YYYYMM15'), // use the 15th of last month as default
            export_columns: 'Ph, Po, Pp, Nq, Cp, Co, Kd, Tr, Tg, Tc, Nr, Td, Fp, Fk, Ts, In',
            display_sort: 'tr_desc, po_asc', // sort by traffic descending, then position ascending
            display_filter: 'tr>=1' // traffic is at least 1
        }
    }
];

const useSemRushApi = (apiKey) => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchSemRushApi = async ({ type, options }) => {
        setIsLoading(true);
        try {
            //find scope in available scopes
            const scope = availableScopes.find((scope) => scope.type === type);
            
            //if scope not found, throw error
            if (!scope) {
                throw new Error(`Invalid scope type: ${type}`);
            }
            
            //destructure required and default options
            const { requiredOptions, defaultOptions } = scope;
            
            //merge default options with options passed in
            const requestOptions = { ...defaultOptions, ...options };

            //check if required option is present - if not, throw error
            requiredOptions.forEach((requiredOption) => {
                if (!requestOptions[requiredOption]) {
                    throw new Error(
                        `Missing required option: ${requiredOption} for scope type: ${type}`
                    );
                }
            });

            //make request
            const response = await fetch(
                `https://api.semrush.com/analytics/v3/${type}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    Authorization: `Bearer ${YOUR_API_KEY}`,
                },
                body: JSON.stringify(requestOptions),
                }
            );
            
            //await data then set state with data in json format
            const data = await response.json();
            setData(data);

        } catch (error) {
            //catch error and set state
            setError(error);

        } finally {
            //set loading to false regardless of success or failure
            setIsLoading(false);
        }
    };

    return { data, isLoading, error, fetchSemRushApi };

};

export default useSemRushApi;
