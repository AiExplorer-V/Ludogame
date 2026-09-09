LUDO ROYALE — ONLINE FRIEND INVITE EDITION

IMPORTANT
This edition fixes the invite problem by adding a real shared game room server.
A plain HTML file opened with content:// or file:// cannot make two different browsers share the same live game state. Therefore, for friends to play the SAME game, run this package through the included Node.js server or deploy it to a public Node.js host.

HOW IT WORKS
1. Install Node.js 18 or newer.
2. Open a terminal in this folder.
3. Run: npm start
4. Open the address shown by the server (normally http://localhost:8080).
5. If friends are on the same Wi-Fi, open the game using your computer's LAN IP instead, for example:
   http://192.168.1.20:8080
   Then the copied invite link will work on their devices on the same network.
6. For friends anywhere on the internet, deploy this folder to any Node.js hosting service. Open the public HTTPS address and use INVITE.

GAME FLOW
• The first player creates the private room and becomes the host (GREEN).
• INVITE copies/shares one room link.
• Every invited person who opens that link joins the SAME lobby and receives the next available colour.
• They do NOT create individual games.
• The host sees all joined players and presses START GAME.
• START GAME is disabled until at least one invited friend has joined.
• After starting, each player can roll and move only on their own turn.
• All browsers synchronize the same board state through the room server.
• Character walking, safe zones, captures, extra rolls and rankings remain enabled.

FILES
index.html  - game interface
server.js   - shared room and game-state server
package.json - start command
README.txt  - instructions
