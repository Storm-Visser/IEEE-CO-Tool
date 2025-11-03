require('dotenv').config();	
const express = require('express')
const app = express()             //use the express app


// TODO Probably part fo the problem, should be changed
const OAuth = require('oauth').OAuth //chatGPT 2.7 delare OAuth  

const path = require('path')
const setupDB = require('./init/setupDB')
const setupLogger = require('./init/setupLogger')
const setupApi = require('./init/setupApi')
const cors = require('cors');
const PORT = process.env.PORT || 3000;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'https://trello.com';

const start = async() => {    //start allows the use of 'wait', initalises the logger
	let log = undefined
	const prestart = async () => { // sets up logger for debugging
		log = setupLogger()
	}
	await prestart().catch(err => {
		console.error(err)
		process.exit(1)
	})

	const startAsync = async () => { //provides the server startup function
		log.info('Application Starting')
		app.set('etag', true)         
		//hash code generated key in app, used for caching optimisation 
		app.use(express.json())       
		//express.json parses json data to js object(req), access js object from req.body, also response (res)
		app.use(cors({ origin: [ALLOWED_ORIGIN] }));    
		// CORS control which external website app can access
		// TODO check if this link changed
		
		await setupDB(app) // initilises database
        
		app.use(express.static('dist', {//serves static files from the 'dist' directory
			setHeaders: function (res, path) { 
				//sets custom http headers on the response for data fiels
				res.set('Content-Security-Policy', "frame-ancestors 'self' https://trello.com;");
			        // sets CSP header that restricts which parent domains can embed your site in iframe
			}

		}

		));
		
		setupApi(app) // sets up API routes, not shown
		
		// basic routing 
		app.get('*', (req, res) => { //handles all unmatched routes by returning the main index.html
			res.sendFile(path.resolve(__dirname, '../../dist/index.html'))
			console.log("Managed getting requirements and resolutions")
		})
                
		//listen for requests, starts the server on a port from .env or defaults to 3000
		const listener = app.listen(PORT, () => {
			console.log(`Server Ready on port ${listener.address().port}`)
		})
	}
	startAsync().catch(err => {
		console.log(err)
		process.exit(1)
	})
}
//index.js on server
//check modules updates??
start()
