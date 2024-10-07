import { z } from "zod"


export const about = [
    { id: 1, head: "Versatile Notification Channels", desc: "Receive timely alerts through your preferred channels when your websites or servers encounter issues. We support SMS, email, Slack, Discord, webhook notification methods, and notifications through our iOS app." },
    { id: 2, head: "Informative Status Pages", desc: "Display the live status of your websites and servers to your users through our easy-to-set-up status pages. Support for custom domain names with HTTPS encryption is included." },
    { id: 3, head: "Multi-Region Monitoring", desc: "Experience rapid issue detection with our premium plans offering 10-second checks from multiple global locations. Get notified quickly when your server experiences downtime." },
    { id: 4, head: "SSL Certificate Expiration Alerts", desc: "Never miss an SSL certificate renewal with our timely alerts. We notify you 30, 14, 7, and 1 day(s) before your certificate expiration." },
    { id: 5, head: "Customizable Fail Thresholds", desc: "Define the number of region failures that trigger an alert with our multi-region monitoring feature. Enhance your downtime detection accuracy and minimize false alarms." },
    { id: 6, head: "Advanced HTTP(S) Monitoring", desc: "Configure custom HTTP headers or payloads for monitoring requests, and check response headers and payloads for thorough website monitoring." }
]


const monitor = z.object({
    id: z.string(),
    name: z.string(),
    url: z.string(),
    time: z.date(),
    userId: z.string()
})

export type Monitor = z.infer<typeof monitor>
