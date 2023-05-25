import { Auth } from 'aws-amplify'
export const awsconfig = {
  aws_project_region: import.meta.env.VITE_REGION,
  Auth: {
    userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
    userPoolWebClientId: import.meta.env.VITE_COGNITO_USER_POOL_WEB_CLIENT_ID,
    region: import.meta.env.VITE_REGION
  },
  API: {
    endpoints: [
      {
        name: 'api',
        endpoint: import.meta.env.VITE_API_ENDPOINT,
        region: import.meta.env.VITE_REGION
      }
    ]
  }
}

export default awsconfig
