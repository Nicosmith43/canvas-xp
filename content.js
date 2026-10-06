(async function getCanvasData() {
  try {
    console.log("Extension is checking for upcoming assignments...");
    const apiResponse = await fetch('/api/v1/users/self/todo');
    
    if (!apiResponse.ok) throw new Error(`Status: ${apiResponse.status}`);
    const data = await apiResponse.json();
    
    const assignments = data.map(item => ({
      title: item.assignment?.name || item.title || "Untitled Assignment",
      dueAt: item.assignment?.due_at || item.ignore_date || null
    }));

    console.log("Extension successfully received due dates:", assignments);
    injectDueDateWidget(assignments);

  } catch (error) {
    console.error("Extension direct fetch error:", error.message);
  }
})();

function calculateTimeRemaining(dueDateString) {
  if (!dueDateString) return { text: "No due date", color: "#888" };

  const now = new Date();
  const dueDate = new Date(dueDateString);
  const timeDiff = dueDate - now;

  // If the assignment is already past due
  if (timeDiff < 0) {
    return { text: "Overdue!", color: "#ff4d4d" };
  }

  const totalHours = Math.floor(timeDiff / (1000 * 60 * 60));
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;

  // Urgent: Less than 24 hours left (Display in bright red/orange)
  if (days === 0) {
    return { text: `⚠️ ${hours}h left!`, color: "#ff943d" };
  }

  // Moderate: Less than 3 days left (Display in gold)
  if (days < 3) {
    return { text: `${days}d ${hours}h left`, color: "#f1c40f" };
  }

  // Plenty of time left (Display in green)
  return { text: `${days}d left`, color: "#2ecc71" };
}

function injectDueDateWidget(assignments) {
  // Create a clean floating card container
  const widget = document.createElement("div");
  
  // Dashboard Visual Styling (UNC Blue Background with rounded frames)
  widget.style.position = "fixed";
  widget.style.top = "20px";
  widget.style.right = "20px";
  widget.style.width = "320px";
  widget.style.maxHeight = "450px";
  widget.style.overflowY = "auto";
  widget.style.backgroundColor = "#002A54"; // Official UNC Dark Blue
  widget.style.border = "2px solid #F6B000";   // Official UNC Gold Accent Border
  widget.style.borderRadius = "12px";
  widget.style.boxShadow = "0px 8px 24px rgba(0,0,0,0.4)";
  widget.style.padding = "16px";
  widget.style.zIndex = "999999"; 
  widget.style.fontFamily = "'Inter', 'Segoe UI', Roboto, sans-serif";
  widget.style.color = "#ffffff";

  // Widget Header Block
  const headerContainer = document.createElement("div");
  headerContainer.style.display = "flex";
  headerContainer.style.justifyContent = "between";
  headerContainer.style.alignItems = "center";
  headerContainer.style.borderBottom = "1px solid rgba(255,255,255,0.15)";
  headerContainer.style.paddingBottom = "10px";
  headerContainer.style.marginBottom = "12px";

  const title = document.createElement("h2");
  title.innerText = "⚡ Athlete Academic Tracker";
  title.style.fontSize = "15px";
  title.style.fontWeight = "bold";
  title.style.margin = "0";
  title.style.letterSpacing = "0.5px";
  headerContainer.appendChild(title);
  widget.appendChild(headerContainer);

  // Task List Frame
  const listContainer = document.createElement("div");
  listContainer.style.display = "flex";
  listContainer.style.flexDirection = "column";
  listContainer.style.gap = "10px";

  if (assignments.length === 0) {
    const emptyState = document.createElement("div");
    emptyState.innerText = "🎉 All caught up! No tasks due.";
    emptyState.style.textAlign = "center";
    emptyState.style.padding = "20px 0";
    emptyState.style.color = "#bdc3c7";
    listContainer.appendChild(emptyState);
  } else {
    // Grab up to the top 6 upcoming items found
    assignments.slice(0, 6).forEach(item => {
      const card = document.createElement("div");
      card.style.backgroundColor = "rgba(255, 255, 255, 0.08)";
      card.style.padding = "10px 12px";
      card.style.borderRadius = "8px";
      card.style.display = "flex";
      card.style.flexDirection = "column";
      card.style.gap = "4px";
      card.style.borderLeft = "4px solid #F6B000"; // Gold boundary stroke

      // Assignment Name Label
      const nameLabel = document.createElement("span");
      nameLabel.innerText = item.title;
      nameLabel.style.fontSize = "13px";
      nameLabel.style.fontWeight = "500";
      nameLabel.style.whiteSpace = "nowrap";
      nameLabel.style.overflow = "hidden";
      nameLabel.style.textOverflow = "ellipsis";
      card.appendChild(nameLabel);

      // Countdown Component Wrapper
      const timeInfo = calculateTimeRemaining(item.dueAt);
      const countdownLabel = document.createElement("span");
      countdownLabel.innerText = timeInfo.text;
      countdownLabel.style.fontSize = "11px";
      countdownLabel.style.fontWeight = "bold";
      countdownLabel.style.color = timeInfo.color;
      card.appendChild(countdownLabel);

      listContainer.appendChild(card);
    });
  }

  widget.appendChild(listContainer);
  document.body.appendChild(widget);
}
