# discourse-football-formation

A Discourse plugin for football supporters to display player lineups visually in posts.

## How to use in posts

Type the following in any post:

```
[formation=4-3-3]
Raya
Timber - Saliba - Gabriel - Zinchenko
Ødegaard - Rice - Havertz
Saka - Jesus - Martinelli
[/formation]
```

The plugin will automatically render a football pitch with players positioned correctly.

### Supported formations

- `4-3-3`
- `4-4-2`
- `4-2-3-1`
- `4-3-2-1`
- `3-4-3`
- `3-5-2`
- `5-3-2`
- `4-5-1`

## Installation

### Step 1 — Log in to your server via SSH

```bash
ssh user@yourserver.com
```

### Step 2 — Clone the plugin into the plugins folder

```bash
cd /var/discourse
git clone https://github.com/yourforum/discourse-football-formation.git plugins/discourse-football-formation
```

> If you haven't published the plugin to GitHub yet, upload the folder manually via SFTP to:
> `/var/discourse/plugins/discourse-football-formation/`

### Step 3 — Rebuild Discourse

```bash
./launcher rebuild app
```

This takes a few minutes. Once complete, the plugin will be active.

### Updating

```bash
cd /var/discourse/plugins/discourse-football-formation
git pull
cd /var/discourse
./launcher rebuild app
```

### Uninstalling

```bash
rm -rf /var/discourse/plugins/discourse-football-formation
./launcher rebuild app
```

## Plugin structure

```
discourse-football-formation/
├── plugin.rb                          ← registers assets
├── assets/
│   ├── stylesheets/
│   │   └── formation.css              ← pitch styles
│   └── javascripts/discourse/
│       └── initializers/
│           └── formation.js           ← rendering logic
└── README.md
```
