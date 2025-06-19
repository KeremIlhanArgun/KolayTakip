# Kolay Takip

Kolay Takip is a simple task tracking board written with vanilla HTML, CSS and JavaScript. It allows users to add, edit and move tasks between three columns: **Open**, **In Progress** and **Done**. This repository has no build step or external dependencies; opening `index.html` in a browser is enough to run the application.

## Project Structure

```
KolayTakip/
├── index.html   # HTML layout of the board and modals
├── script.js    # JavaScript logic for task management
├── style.css    # Styling for the board and modals
└── icon.png     # Favicon used by the page
```

### index.html
* Defines the three columns where tasks are displayed.
* Includes two modal dialogs:
  * **Yeni Task Ekle** – for creating new tasks.
  * **Task Düzenle** – for editing or deleting existing tasks.
* Loads `style.css` and `script.js`.

### style.css
* Provides layout and basic styles.
* Includes animations for the task creation button.
* Uses the `.done` class to lower the opacity of completed tasks.

### script.js
* Waits for `DOMContentLoaded` before attaching event listeners.
* Manages opening/closing modals and disabling/enabling form buttons.
* Creates task cards on the fly and allows dragging them between columns.
* Supports editing and deleting tasks through the **Task Düzenle** modal.
* Updates a task’s appearance when moved to the **Done** column.

## Key Points for New Contributors

1. **No build tools:** All logic is in plain JavaScript and runs directly in the browser.
2. **State stored in the DOM:** Task data lives only in the page DOM. There is no persistence once the page is refreshed.
3. **Event delegation:** The code frequently clones buttons (`cloneNode(true)`) before reassigning event listeners to avoid duplicates.
4. **Drag and drop:** Functions `makeTaskDraggable` and `makeColumnDroppable` implement basic drag-and-drop support.
5. **Form validation:** `checkRequiredFields` ensures a task name is entered before enabling the “Oluştur” button.

## Next Steps to Explore

* **Persisting Tasks:** Consider saving tasks to local storage or integrating a backend service so that data survives page reloads.
* **Testing:** Currently there are no automated tests. Adding unit tests (e.g., with Jest or Cypress) would help maintain future changes.
* **Code Organization:** Splitting `script.js` into smaller modules could improve readability and make the logic easier to maintain.
* **Accessibility & Responsiveness:** Review the UI for keyboard accessibility and mobile responsiveness.

For any questions or improvements, feel free to open an issue or submit a pull request.
