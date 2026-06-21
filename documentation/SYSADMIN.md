# Maintenance

The app should be as low-maintenance as possible, but the following information may be helpful for initial setup or in case of troubleshooting.

## The DevTools Console

Some debug information is logged in the console.

See [the configuration documentation](README.md#configuration) for how to export the current configuration as a base64-encoded JSON string.

You may also temporarily override the timestamp used by the calendars through the `__DATE_OVERRIDE` variable in the console. You may need to reload widgets to update them, and the override will persist until the page is reloaded.

```js
__DATE_OVERRIDE = new Date('2020-01-01T08:10:00')
__DATE_OVERRIDE = new Date('Jan 1 2000')
__DATE_OVERRIDE = undefined // Another way to clear the override
```

## Updates

(TODO explain github pages)

## Google API

(TODO mention API key restrictions etc)

# Data Guidelines

## Calendars

### Expected Data Format

(TODO list each one used)

### External (non-Google) Calendars

(TODO how to subscribe and get calendar ID)

## Slideshow

(TODO explain margin and aspect ratio)
