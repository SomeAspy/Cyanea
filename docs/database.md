# Database File
This bot works off a local JSON database

- `example` - `boolean` - Calls out the user if they are using the unmodified example file
- `readable` - `boolean` - This should always be `true`
- `devMode` - `boolean` - Whether or not the bot pushes commands to the development guild only
- `devGuild` - `Guild ID` - The development guild ID, only needed if `devMode` is ` true`
- `status` - `online/dnd/idle/offline` - The bots presence
- `statusText` - `string` - The bots status
- `defaultPrefix` - `string` - The bots default prefix
- `servers` - `object` - List of servers the bot has settings for, stored by server ID
- `<server ID>` - `Guild ID` - The guild the settings in this object apply to
    - `prefix` - `string` - The guilds set prefix
    - `linkFilter` - `object` - Storage for the link white/blacklist
        - `blacklist` - `string array` - Array of domains to delete from messages
        - `whitelist` - TBD
    - `userFilter` - `object` - Storage for the user white/blacklist
        - `whitelistEnabled` - `boolean` - Block users who are not on the whitelist
        - `blacklist` - `string array` - users to ban from the bot
        - `whitelist` - `string array` - users to allow to use the bot (effective only when `whitelistEnabled` is `true`)
    - `replyTo` - `object` - Storage for automatic responses
        - `<trigger>` - `string` - The trigger to send the text, the value is what is sent.
    - `reactTo` - `object` - Storage for automatic reactions
        - `<trigger>` - `string` - The trigger to react, the value should be the emote ID
    - `slashOverrides` - `object` - Storage for slash command permissions overrides
        - `<slashName>` - `string` - The slash command to apply the permissions to
            - `id` - `string` - The ID to apply these permissions to
            - `type` - `TBD` - `TBD`
            - `permission` - `boolean` - whether to allow or block in the given conditions