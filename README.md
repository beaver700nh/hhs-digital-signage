# HHS Digital Signage

Source code for signage such as the TV in the lobby. Written by Holliston High School student Minh Le ('26).

This page shows general information about the app interface. For maintenance information, see [SYSADMIN.md](documentation/SYSADMIN.md).

## Widgets

![Screenshot of the app](documentation/assets/screenshot.png)

<!-- TODO add explanations of all features, especially edge cases -->

### Day Info **<code>&#x25f0;</code>**

- Shows when the next school day is and what letter day it is
- Big letter showing what period is first
- Absolute and relative formatting of the date

### Carousel **<code>&#x25f1;</code>**

#### 1. Bell Schedule

- Shows the day's schedule with period start/end times

#### 2. Upcoming Lunch

- Shows upcoming lunch menus with specials and sides

#### 3. Athletics Events

- Shows upcoming sports games with time, teams, and location

### Slideshow **<code>&#x25e8;</code>**

- TODO write this

## Controls

- **Left-click** on a widget to reload it
- **Right-click** the carousel to switch to the next widget
- **Ctrl + right-click** the carousel to stop cycling widgets
	- Resume cycling by right-clicking once

## Configuration

Set these options in LocalStorage as specified, or remove them completely for the default behavior. Changes take effect on page reload.

See [`localStorageDefaults`](src/data/api.ts#L100) for the default values.

#### `dayRolloverTime` (number 0-24)

- Hour of day when the calendar-based widgets should start fetching the next day's information.

#### `disableHtmlSchedule` (Boolean-like)

- Forces HTML bell schedules to render as sanitized plain text when set to something truthy, i.e. `1`.

#### `disableWidgets` (integer array)

- Removes the specified widgets (zero-indexed) from the carousel.
- For example, `[0, 2]` will hide the first and third widgets.

#### `bellScheduleSize` (number)

- Font size multiplier for the bell schedule widget.

#### `lunchListMax` (integer)

- Maximum number of daily menus to show in the lunch widget.

#### `athleticsListMax` (integer)

- Maximum number of athletics events to show in the athletics widget.

#### `calendarScrollSpeed` (number >0)

- Average pixels per second to scroll if a widget with a list overflows.
- Scroll speed may momentarily exceed this value to compensate for time spent on easing.
- Only applies when the list is long enough to scroll.

#### `calendarScrollPause` (number &ge;0)

- Milliseconds to pause between the widget lists' scrolling.
- Only applies when the list is long enough to scroll.

#### `carouselAdvanceInterval` (number >0)

- Milliseconds it takes before the carousel advances to the next widget.

#### `carouselRefreshInterval` (number >0)

- Milliseconds between reloads of each carousel widget.

#### `slideshowAdvanceInterval` (number >0)

- Milliseconds it takes before the slideshow advances to the next slide.

#### `slideshowRefreshInterval` (number >0)

- Milliseconds between reloads of the slideshow embed.
- Upstream changes will only be reflected after this reload occurs.
