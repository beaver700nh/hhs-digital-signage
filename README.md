# HHS Digital Signage

Source code for signage such as the TV in the lobby. Written by Holliston High School student Minh Le ('26).

## Controls

- **Left-click** on a widget to reload it
- **Right-click** the carousel to switch to the next widget
- **Ctrl + right-click** the carousel to stop cycling widgets
	- Resume cycling by right-clicking once

## Configuration

Set these options in LocalStorage as specified, or remove them completely for the default behavior. Changes take effect on page reload.

#### `disableHtmlSchedule` (number)

- Forces HTML bell schedules to render as plain text when set to `1`.

#### `disableWidgets` (array)

- Removes the specified widgets (zero-indexed) from the carousel. For example, `[0, 2]` will hide the first and third widgets.
