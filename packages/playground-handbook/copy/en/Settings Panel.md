## Settings Panel

Hidden in the top right corner, under "Search Docs" is the "Settings" button where you can access the settings for the Playground. There are not many settings in the Playground.

### Playground Options

**"Disable ATA"**

Turns off [Type Acquisition](/play#handbook-5) which means that when importing code, the Playground will not try to acquire the types via the internet.

**"Disable Save-On-Type"**

When the editor loses focus, or compiler flags change, the Playground will replace the URL in your browser. This doesn't change the behavior of the back button, but it does add history entries in the browser. You can turn off this behavior via this setting, and you can use the 'Share' (or press <kbd>cmd/ctrl</kbd> + <kbd>s</kbd>) to copy the sharable URL.

**"Disable Loop Protection"**

When running code, the Playground adds a small guard to every loop so that a loop which blocks the page for over a second (like `while (true) {}`) exits instead of freezing the browser tab. If your code intentionally runs long loops, you can turn the guards off via this setting — it applies the next time you press "Run", no reload needed.

### Sidebar Tabs

You can choose which tabs are available in the Playground sidebar via the toggle boxes under above Playground Options.
