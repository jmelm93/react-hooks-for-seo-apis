# 
# Once the deployment is complete, your CORS Anywhere server will be live and available for use. You can access it by using the following URL:
# https://<your-heroku-app-name>.herokuapp.com/
# 
# Simply append the URL of the API you want to make a request to after the base URL of your CORS Anywhere server. 
# For example, if you want to make a request to the SEMrush API, you would use the following URL:
# https://YOUR_HEROKU_APP_NAME.herokuapp.com/https://api
# 

npm install -g heroku # Install Heroku CLI
git clone https://github.com/Rob--W/cors-anywhere.git # Clone the CORS Anywhere repository
cd cors-anywhere # Navigate to the CORS Anywhere directory
heroku create # Create a new Heroku app
git push heroku master # Deploy the CORS Anywhere server to Heroku


