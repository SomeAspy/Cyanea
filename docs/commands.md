# Commands

- Fun
    - None yet
- Moderation
    - `Ban` - (Text Command) - `?ban @user reason`
        - Ban a user with an optional reason
    - `Kick` - (Text Command) - `?kick @user reason`
        - Kick a user with an optional reason
    - `Mute` - (Text Command) - `?mute @user 10m reason`
        - Mute a user, valid units are `s, m, h, d, w`
    - `Unmute` - (Text Command) - `?unmute @user reason`
        - Unmute a user
- Music
    - None yet
- Utility
    - `Reactions` - (Slash Command) - `/reactions`
        - List reaction triggers
    - `Reaction Manager` - (Slash Command) - `/reactionmanager`
        - `/reactionmanager add` - `trigger text`, `reaction`
            - Add a reaction trigger
        - `/reactionmanager remove` - `trigger text`
            - Remove a reaction trigger
    - `Tag Manager` - (Slash Command) - `/tagmanager`
        - `/tagmanager add` - `trigger text`, `response`
            - Add a tag
        - `/tagmanager remove` - `trigger text`
            - Remove a tag
    - `Tags` - (Slash Command) - `/tags`
        - List tags
- Management
    - `Stop` - (Text Command) - `?stop`
        - Gracefully shut down the bot