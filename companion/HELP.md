## Zoom Tiles

## Configuration

To configure this module, you need to provide the following settings:

- **Target IP**: The IP address of the computer running Zoom Tiles application
- **Zoom Tiles Receiving Port**: The port number that Zoom Tiles is listening on (default: 3456)

Make sure the Zoom Tiles application is running and configured to receive OSC commands on the specified port.

## Usage

### Using Variables with User Names

Actions that require a **userName** parameter support Companion variables. This allows you to dynamically specify users in your commands.

**Integration with ZoomOSC/ZoomISO:**

1. Add the ZoomOSC or ZoomISO module to your Companion instance
2. Use their user selection actions to choose a participant
3. Reference the `$(zoomOSC:selectedUser)` or `$(zoomISO:selectedUser)` variable in Zoom Tiles actions
4. This allows you to perform operations like Favorite, Block, or Replace on dynamically selected users

**Example:** In a "Favorite by User Name" action, use `$(zoomOSC:selectedUser)` instead of typing a static name.

## Supported Actions and Feedbacks

| Category | Name | Description |
|----------|------|-------------|
| Block | Block by Index | Block a tile using the gallery index and tile index. |
| Block | Block by User Name | Block user(s) by User Name. For multiple users, separate names with a comma. |
| Capture | Start Capture Engine | Start the capture engine to begin capturing video tiles. |
| Capture | Stop Capture Engine | Stop the capture engine to end capturing video tiles. |
| Config | Load Configuration | Load a configuration file from an absolute path on disk. |
| Favorite | Favorite by Index | Favorite a tile using the gallery index and tile index. |
| Favorite | Favorite by User Name | Favorite user(s) by User Name. For multiple users, separate names with a comma. |
| Gallery Timer | Activate Hole Punch | Activate hole punch for a specific gallery view. |
| Gallery Timer | Deactivate Hole Punch | Deactivate Hole Punch for a specific gallery view. |
| Gallery Timer | Disable Gallery | Disable a specific gallery view. |
| Gallery Timer | Enable Gallery | Enable a specific gallery view. |
| Gallery Timer | Start Queue Timer | Start the queue timer for gallery updates. |
| Gallery Timer | Stop Queue Timer | Stop the queue timer for gallery updates. |
| Join Leave | Join Meeting | Join a meeting with Meeting ID, Password, and Display Name |
| Join Leave | Leave Meeting | Leave the current meeting |
| Join Leave | Start Instant Meeting | Start an instant meeting |
| Join Leave | Start Personal Meeting ID | Start a meeting using your Personal Meeting ID |
| Join Leave | ZAK Join Meeting | Join a meeting using ZAK token, Meeting ID, Password, and Display Name |
| Replace | Replace by User Name | Replace user in the gallery with a new user regardless of where they are in the gallery. |
| Replace | Replace Tile Index with Tile Index | Replace a Tile Index with another Tile Index. |
| Replace | Replace User with Tile Index | Replace a user with a specific gallery/tile index. |

