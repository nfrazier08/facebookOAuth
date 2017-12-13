# facebookOAuth
To run this: 
    nodemon src/server.js
    you can add environmental variables in heroku
    
Setting up an app in Facebook:
    1. You will need to have a Facebook account
        -Go to https://developers.facebook.com/apps/
        -Add a new app
            -Choose a name and enter your email
            -App id and secret is shown in settings tab
    2. Under the products tab
        -Click 'Add Product'
        -Select 'Set up' from the 'Facebook Login' selection (Will not be using quick start)        
        -Select the 'Other' tab
    3. In app settings under Products on the left panel,   
        -Under 'Valid Oauth redirect URI's':
            -type in the url your app lives at (root server)
            -http://localhost:8080
            -Click 'save changes'
    4. Go to main settings tab, and at the bottom, click 'Add Platform' and select 'Website'
        -In the 'Site Url' enter the same root server (http://localhost:8080) and then under app domains type in 'localhost'
        -Save changes!

