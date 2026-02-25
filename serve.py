#!/usr/bin/env python3
import os
import sys

# Change to the project directory BEFORE importing http.server
os.chdir('/Volumes/LaCie/Other/NW Website Refresh')

from http.server import HTTPServer, SimpleHTTPRequestHandler

port = 8080
server = HTTPServer(('', port), SimpleHTTPRequestHandler)
print(f'Serving on http://localhost:{port}')
sys.stdout.flush()
server.serve_forever()
