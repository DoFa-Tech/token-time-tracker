#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const https = require('https');
const http = require('http');

// API URL constant
const API_URL = 'https://tokenti.me/api';
const API_URL_TEST = 'http://localhost:3000/api';

// Parse command line arguments
const args = process.argv.slice(2);
let userId = null;
let isTest = false;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--test') {
    isTest = true;
  } else if (!userId) {
    userId = args[i];
  }
}

// Validate userId
if (!userId) {
  console.error('Error: userId parameter is required');
  console.error('Usage: token-time-tracker <userId> [--test]');
  process.exit(1);
}

// Determine API endpoint
const apiUrl = isTest ? API_URL_TEST : API_URL;

if (!apiUrl) {
  console.error('Error: API_URL is not configured and --test flag was not provided');
  process.exit(1);
}

async function postData(url, data) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(JSON.stringify(data))
      }
    };

    const protocol = urlObj.protocol === 'https:' ? https : http;
    
    const req = protocol.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ status: res.statusCode, data: responseData });
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${responseData}`));
        }
      });
    });
    
    req.on('error', reject);
    req.write(JSON.stringify(data));
    req.end();
  });
}

async function getData(url) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: 'GET'
    };

    const protocol = urlObj.protocol === 'https:' ? https : http;
    
    const req = protocol.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ status: res.statusCode, data: responseData });
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${responseData}`));
        }
      });
    });
    
    req.on('error', reject);
    req.end();
  });
}

async function main() {
  try {
    // First, get the last update day from the API
    const getLastUpdateUrl = `${apiUrl}/get_last_update_day?userId=${userId}`;
    console.log('Getting last update day...');
    const lastUpdateResponse = await getData(getLastUpdateUrl);
    const lastUpdateData = JSON.parse(lastUpdateResponse.data);
    
    console.log('Last update day:', lastUpdateData.lastUpdateDay);
    
    // Use the locally installed ccusage
    const ccusagePath = path.join(__dirname, 'node_modules', '.bin', 'ccusage');
    let ccusageCommand = `${ccusagePath} daily --json --breakdown`;
    
    // Add --since parameter if lastUpdateDay is provided
    if (lastUpdateData.lastUpdateDay) {
      ccusageCommand += ` --since "${lastUpdateData.lastUpdateDay}"`;
    }
    
    const output = execSync(ccusageCommand, { encoding: 'utf8' });
    
    // Parse the JSON output
    const ccusageData = JSON.parse(output);

    console.log("Data found for ", ccusageData.daily.length, " days");
    
    // Prepare the payload
    const payload = {
      userId: userId,
      data: {
        daily: ccusageData.daily
      }
    };
    
    // Post to API
    const fullApiUrl = `${apiUrl}/usage`;
    console.log(`Uploading usage data...`);
    const response = await postData(fullApiUrl, payload);
    console.log('Success! You can check your usage at https://tokenti.me');
    
  } catch (error) {
    if (error.message.includes('ccusage')) {
      console.error('Error running ccusage command:', error.message);
    } else if (error.message.includes('JSON')) {
      console.error('Error parsing ccusage output:', error.message);
    } else if (error.message.includes('get_last_update_day')) {
      console.error('Error getting last update day:', error.message);
    } else {
      console.error('Error posting data to API:', error.message);
    }
    process.exit(1);
  }
}

main();