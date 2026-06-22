# Maintenance

The app should be as low-maintenance as possible, but the following information may be helpful for initial setup or in case of troubleshooting.

## The DevTools Console

Some debug information is logged in the console.

See [the configuration documentation](/README.md#configuration) for how to export the current configuration as a base64-encoded JSON string.

You may also temporarily override the timestamp used by the calendars through the `__DATE_OVERRIDE` variable in the console. You may need to reload widgets to update them, and the override will persist until the page is reloaded.

```js
__DATE_OVERRIDE = new Date('2020-01-01T08:10:00')
__DATE_OVERRIDE = new Date('Jan 1 2000')
__DATE_OVERRIDE = undefined // Another way to clear the override
```

## Updates

> [!IMPORTANT]
> **_You must copy the deployment URL (e.g. `https://<username>.github.io/hhs-digital-signage/`) and set it as the `homepage` for the app to be usable._** Change it [here](/package.json#L5) before deployment.

At the time of this writing, the app is intended to be hosted on GitHub Pages because it's free and has good integration with GitHub. To set up Pages deployment, go to `Settings > Pages` and change `Source` from `Deploy from a branch` to `GitHub Actions`.

<img src="/documentation/assets/git-pages-default.png" alt="Screenshot of the default Pages settings" width="600">

Now, GitHub Actions should automatically deploy the app when the so-called "workflow" is triggered. By default it is triggered manually in `Actions > Deploy to GitHub Pages > Run workflow > Run workflow`.

<img src="/documentation/assets/git-pages-actions.png" alt="Screenshot of the Actions page on GitHub" width="600">

You can also set it to trigger on every new code push. One example of such a setup would be to make the following change in [cicd.yml](/.github/workflows/cicd.yml):

```diff
- on: workflow_dispatch

+ on:
+   workflow_dispatch
+   push:
+     branches: [main]
```

Once you trigger the first deployment (with any of the above methods), you will be able to see the status of the workflow run on the same `Actions` page as above. Click on a run to see its logs.

<img src="/documentation/assets/git-pages-wf-run.png" alt="Screenshot of a sample workflow run" width="600">

If it succeeds, you can go back to `Settings > Pages` and you should see something like this:

<img src="/documentation/assets/git-pages-deployed.png" alt="Screenshot of the Pages settings after deployment" width="600">

If you click `Visit site`, you should hopefully see the app live!

> [!NOTE]
> Content may not load until you have set up the Google API.

## Google API

You will need a Google Cloud project with the Calendar API enabled. Create a new project [here](https://console.cloud.google.com/home/dashboard). Then, go to the [API dashboard](https://console.cloud.google.com/apis/dashboard) for your new project and enable the Google Calendar API under `Enable APIs and Services`.

You will need an API key to access this API. Go to the [Credentials tab](https://console.cloud.google.com/apis/credentials) and click `+ Create credentials > API key`. Name it whatever you want, and you can set restrictions to prevent unauthorized use.

Be sure to enable the Google Calendar API, and you can set the application restrictions to `Websites` and add the your deployment URL (from above) to the allowed referrers list. (You do not need to add `localhost`.)

> [!IMPORTANT]
> Add an asterisk (`*`) at the end of the URL to allow all pages within the app to access the API. See the screenshot for an example.

<img src="/documentation/assets/api-key-setup.png" alt="Screenshot of the API key configuration" width="400">

Finally, you can copy the API key from `Additional information > Show key` and set it in the app configuration as detailed [here](/README.md#google-calendar-api).

# Data Guidelines

The app is pretty lenient on what it accepts as input, and the algorithms are based on real historical data, so it should work as long as you pretty much stick to these guidelines.

## Slideshow

Due to screen real estate being taken up by the other widgets, the *slideshow* aspect ratio is 4:3, *not* 16:9. Keep this in mind when creating/importing slides.

Also, a thin margin around the edges is cut off to make the embed more seamless. Do not put slideshow content excessively close to the edges, or it will be cut off.

## Calendar Widgets

### 1. Bell Schedule

<img src="/documentation/assets/bell-schedule-b.png" alt="Screenshot of real-world data" height="400">

Each event on the calendar should be titled with what kind of day it is, e.g.:

- A Day
- Exams A&B
- Exam C
- D Block Exams
- Transition Day - D Day

Anything with at least "exam", "transition", or "day", or a letter A-G by itself, or a combination of those will be treated as a valid day. Besides the bare minimum, you can include other information. The following references in the title will trigger special styling:

- exam
- MCAS
- transition
- last
- half
- 1/2
- special
- \* (asterisk)
- schedule

Event titles containing the following will be treated as breaks instead of school days and will be displayed as such below the schedule, on the day before the break. Breaks may be multi-day events.

- no school
- break
- vacation
- holiday

Event descriptions should contain the day's bell schedule, if applicable. The app has some support for HTML, so that tables and rich text pasted from external environments are rendered properly. If you are paranoid about HTML injection, you can disable this in the configuration.

The schedule should follow roughly the following format, and if it is improperly formatted the app will make its best attempt to parse it, progressively downgrading to simpler rendering the more corrupted it is. Indentation is optional.

<img src="/documentation/assets/bell-schedule-a.png" alt="Screenshot of real-world data" height="300">
<img src="/documentation/assets/bell-schedule-e.png" alt="Screenshot of real-world data" height="300">
<img src="/documentation/assets/bell-schedule-d.png" alt="Screenshot of real-world data" height="300">
<img src="/documentation/assets/bell-schedule-c.png" alt="Screenshot of real-world data" height="300">

### 2. Upcoming Lunch

<img src="/documentation/assets/upcoming-lunch-a.png" alt="Screenshot of real-world data" height="100">
<img src="/documentation/assets/upcoming-lunch-b.png" alt="Screenshot of real-world data" height="100">

Event titles should be the name of the meal (usually the special of the day), and descriptions should be the sides or alternatives, separated by commas, semicolons, hyphens, slashes, or line breaks.

### 3. Upcoming Sports Events

<img src="/documentation/assets/upcoming-sports-a.png" alt="Screenshot of real-world data" height="240">
<img src="/documentation/assets/upcoming-sports-b.png" alt="Screenshot of real-world data" height="240">
<img src="/documentation/assets/upcoming-sports-c.png" alt="Screenshot of real-world data" height="240">
<img src="/documentation/assets/upcoming-sports-d.png" alt="Screenshot of real-world data" height="240">

Event titles should be formatted as follows. The "vs opponent" part may be omitted.

```
<cohort> <sport> <vs> <opponent>
```

| Field    | Example |
| -------- | ------- |
| cohort   | Girls Varsity, Boys JV, Coed Varsity |
| sport    | Football, Tennis, Track & Field |
| vs       | vs, at, @ |
| opponent | Hopkinton High School, Oakmont Regional |

Event descriptions should be formatted roughly following the screenshots. Some data may be omitted; the app will fall back to data from the title if applicable.

## External (non-Google) Calendars

> [!TIP]
> Calendars outside of Google Calendar are accessible through the Google Calendar API if you import them into Google Calendar.

For example, the athletics calendar is from a different system found on the Holliston High School website.

<img src="/documentation/assets/add-calendar.png" alt="Screenshot of the Google Calendar import screen" width="600">

In the external calendar, find a way to export it in the iCal format, ideally as a URL you can copy. In Google Calendar, go to `Other calendars > + > From URL` and paste it. Tick `Make the calendar publicly accessible` and click `Add calendar`.

If you are unable to export your calendar online, you may also download it as an ICS, VCS, or CSV file. Then go to `Other calendars > + > Import` instead and upload it there.

> [!WARNING]
> If you import it this way, upstream changes will not be reflected in the app and you will have to redownload and reimport the calendar to sync changes.

Finally, the calendar will have an ID under `Calendar settings > Integrate calendar > Calendar ID` just like any other calendar. This ID may be used in the code of a widget just like any other; however, programming is beyond the scope of this documentation.
