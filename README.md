Chattus
=======

Chattus is a lightweight, completely self-contained chat server and client.


## Requirements

* MongoDB server
* Node.js
* Node.js mongodb driver


## Running

server.js contains a few usage-specific variables that will need to be set 
before running the server.  These include port and address details.

server.js depends on the __mongodb__ Node.js driver.  To install from npm, run:

    npm install mongodb 

After that, simply run server.js.

    node server.js

If Node.js is in the user's environment variable, then the server can be run:

    ./server.js

Please remember to review the terms of the License if running this on a 
production server.


## Files

__chat.html__ --- The client-side chat page

__chat.js__ --- The client-side chat script that interacts with 
                the Chattus server

__index.html__ --- The Chattus 'landing page', served whenever a non-chat page 
                   is requested

__server.js__ --- The Node.js server; Chattus is completely self-serving, and 
                  the entire system is powered by this file


## License

 Copyright 2012 Glen Oakley

   Licensed under the GNU Affero General Public License, version 3.  
   This allows users who interact with this software over a network to 
   receive the source.

   This program is free software: you can redistribute it and/or modify it 
   under the terms of the GNU Affero General Public License as published by 
   the Free Software Foundation, either version 3 of the License, or 
   (at your option) any later version.

   This program is distributed in the hope that it will be useful, but 
   WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU Affero General Public License for more details.
