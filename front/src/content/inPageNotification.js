/* מציג הודעה קופצת בתוך דף האתר החיצוני*/
export function showInPageNotification(message, icon, type) {
  const notification = document.createElement("div");
  notification.id = "pm-extension-notification";
  notification.className = `pm-notification pm-notification-${type}`;

  /*בניית התוכן הפנימי*/
  const iconSpan = document.createElement("span");
  iconSpan.className = "pm-notification-icon";
  iconSpan.textContent = icon;

  const messageSpan = document.createElement("span");
  messageSpan.className = "pm-notification-message";
  messageSpan.textContent = message;

  const closeButton = document.createElement("button");
  closeButton.className = "pm-notification-close";
  closeButton.textContent = "✕";
  closeButton.setAttribute("aria-label", "Close");
  closeButton.addEventListener("click", () => notification.remove());

  /*הרכבת ההודעה*/
  notification.appendChild(iconSpan);
  notification.appendChild(messageSpan);
  notification.appendChild(closeButton);

  /*הסרת הודעה קודמת אם קיימת (מונע ערמה של הודעות)*/
  const existing = document.getElementById("pm-extension-notification");
  if (existing) existing.remove();

  /*הוספת ההודעה לדף*/
  document.body.appendChild(notification);
}