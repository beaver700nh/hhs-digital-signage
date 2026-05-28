# HHS Digital Signage

Source code for signage such as the TV in the lobby. Written by Holliston High School student Minh Le ('26).

## Controls

- **Left-click** on a widget to reload it
- **Right-click** the carousel to switch to the next widget
- **Ctrl + right-click** the carousel to stop cycling widgets
	- Resume cycling by right-clicking once

## Widgets

### Today Overview

- Grabs next available school day from calendar
	- Rolls over to the next day at 5:00 PM
	- Could be today or maybe next Monday if today is the weekend
- Big letter showing what period is first
- Absolute and relative formatting of the date

### 1. Bell Schedule (Carousel)

- Shows the day's schedule with period start/end times

### 2. Upcoming Lunch (Carousel)

- Shows upcoming lunch menus with specials and sides

### 3. Athletics Events (Carousel)

- Shows upcoming sports games with time, teams, and location

## Configuration

Set these options in LocalStorage as specified, or remove them completely for the default behavior. Changes take effect on page reload.

See [`localStorageDefaults`](src/data/api.ts#L100) for the default values.

#### `disableHtmlSchedule` (number)

- Forces HTML bell schedules to render as sanitized plain text when set to `1`.

#### `disableWidgets` (array)

- Removes the specified widgets (zero-indexed) from the carousel.
- For example, `[0, 2]` will hide the first and third widgets.

#### `lunchListMax` (number)

- Maximum number of daily menus to show in the lunch widget.

#### `athleticsListMax` (number)

- Maximum number of athletics events to show in the athletics widget.

#### `athleticsScrollSpeed` (number)

- Pixels per second to scroll if the athletics list overflows.
- Only applies when the list is long enough to scroll.

#### `athleticsPauseDuration` (number)

- Milliseconds to pause between the athletics list scrolling.
- Only applies when the list is long enough to scroll.

#### `carouselAdvanceInterval` (number)

- Milliseconds it takes before the carousel advances to the next widget.

#### `carouselRefreshInterval` (number)

- Milliseconds between reloads of each carousel widget.

#### `slideshowAdvanceInterval` (number)

- Milliseconds it takes before the slideshow advances to the next slide.

#### `slideshowRefreshInterval` (number)

- Milliseconds between reloads of the slideshow embed.
- Upstream changes will only be reflected after this reload occurs.
